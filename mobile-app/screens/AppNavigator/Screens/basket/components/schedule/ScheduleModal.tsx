import React, {memo, RefObject, useCallback, useEffect, useMemo, useState} from "react";
import {getColor, tailwind} from "@tailwind";
import {FlatList, Pressable, Text, TouchableOpacity, View,} from "react-native";
import * as Device from 'expo-device'
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps,
    BottomSheetFooter,
    BottomSheetFooterProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {VendorOperationSetting, VendorUserI} from "@nanahq/sticky";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import moment from 'moment'
import Checkbox from "expo-checkbox";
import {formatRelativeDate} from "../../../../../../../utils/DateFormatter";
import {CircleX} from "lucide-react-native";

type ScheduleDeliveryProps =   {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    onDismiss?: () => void
    vendor: VendorUserI

    onScheduleSet: (time:{time: string, date: string}) => void
    startDate?: number;

    endDate?: number

}

interface TimeSlot {
    start: string;
    end: string;
}

interface ScheduleItem {
    date: string;
    timeSlots: TimeSlot[];
}

const CustomBackdrop = ({ animatedIndex, style, ...props }: BottomSheetBackdropProps) => {
    const { dismiss } = useBottomSheetModal();
    return (
        <Pressable
            onPress={() => dismiss()}
            style={[
                style,
                tailwind("absolute inset-0 bg-black bg-opacity-60")
            ]}
            {...props}
        />
    );
};

 const _ScheduleDeliveryModal:React.FC<ScheduleDeliveryProps> = (props) => {
    const  operations  = props.vendor?.settings?.operations as VendorOperationSetting
    const [selectedDate, setSelectedDate] = useState<string >(operations?.startTime ?? '');
    const [selectedTime, setSelectedTime] = useState<string>(operations?.cutoffTime ?? '');
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);
    const startDate = useMemo(() => {
        return props.startDate ?? moment()
    }, [props.startDate])


     const generateSchedule = () => {
         const schedules: ScheduleItem[] = [];
         let currentDate = moment(props.startDate);
         const end = props.endDate ? moment(props.endDate) : moment(startDate).add(3, 'days')
         while (currentDate.isSameOrBefore(end)) {
             const isToday = currentDate.isSame(moment(), 'day');
             schedules.push({
                 date: `${formatRelativeDate(currentDate)} ${currentDate.format('Do')}`,
                 timeSlots: generateTimeSlots(operations?.startTime, operations?.cutoffTime, isToday),
             });
             currentDate = currentDate.add(1, 'day');
         }

         setSchedule(schedules);
     };



     const generateTimeSlots = (start: string = '', end: string = '', isToday: boolean = false): TimeSlot[] => {
         const timeSlots: TimeSlot[] = [];
         const currentTime = moment(start);
         const endTime = moment(end);
         const now = moment();

         endTime.set({
             days: now.get('days')
         })

         currentTime.set({
             minute: Math.ceil(now.minute() / 5) * 5,
             days: now.get('days')
         })

         if (isToday) {
             currentTime.set({
                 hour: now.isAfter(currentTime) ? now.hour() : currentTime.hour(),
             });
         }

         // Check if the current time is before the restaurant's start time
         if (currentTime.isBefore(moment(operations?.startTime))) {
             currentTime.set({
                 hour: moment(operations?.startTime).hour(),
                 minute: moment(operations?.startTime).minute(),
             });
         }

         while (currentTime.isBefore(endTime) && !currentTime.isSameOrAfter(endTime)) {
             timeSlots.push({
                 start: currentTime.format('HH:mm'),
                 end: currentTime.add(30, 'minutes').format('HH:mm'),
             });
         }
         return timeSlots;
     };

    useEffect(() => {
        generateSchedule();
    }, [operations?.startTime, operations?.cutoffTime, startDate]);

    const selectDate = (date: string) => {
        setSelectedDate(date);
    };

    const selectTime = (time: string) => {
        setSelectedTime(time);
    };

     const { dismiss } = useBottomSheetModal();

     const getSnapPoints = (): string[] => {
         return ["90%"]
     }

     const closeModal = useCallback(() => {
         dismiss(props.promptModalName);
         props.onDismiss?.();
     }, [props.promptModalName, props.onDismiss]);


    return (
        <BottomSheetModal
            enableContentPanningGesture={true}
            enableHandlePanningGesture={true}
            enablePanDownToClose={true}
            handleHeight={20}
            enableDismissOnClose={true}
            handleComponent={() => <View style={tailwind('flex flex-row justify-center w-full')}>
                <View style={tailwind('h-1 w-28 bg-gray-400 rounded-full')} />
            </View>}
            onDismiss={props.onDismiss}
            index={0}
            footerComponent={({animatedFooterPosition}) => (
                <ModalFooter
                    animatedFooterPosition={animatedFooterPosition}
                    scheduleDate={() => {
                        props.onScheduleSet({
                            time: selectedTime,
                            date: selectedDate
                        })
                        closeModal()
                    }}
                />
            )}
            onChange={(index) => {
                if (index === -1) {
                    closeModal()
                }
            }}
            name={props.promptModalName}
            ref={props.modalRef}
            snapPoints={getSnapPoints()}
            backdropComponent={CustomBackdrop}
            backgroundComponent={(backgroundProps: BottomSheetBackgroundProps) => (
                <View
                    {...backgroundProps}
                    style={tailwind('bg-primary-50 rounded-t-xl')}
                />
            )}
        >
            <View style={tailwind('bg-white rounded-t-3xl px-5 pt-10 flex-1')}>
                <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                    <Text style={tailwind('text-lg font-semibold text-slate-900')}>Schedule delivery</Text>
                    <TouchableOpacity onPress={closeModal}>
                        <CircleX style={[tailwind('text-gray-400')]} size={32} />
                    </TouchableOpacity>
                </View>
                <View style={tailwind('flex-col mt-4')}>
                    <FlatList
                        data={schedule}
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        keyExtractor={(item) => item.date}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={[
                                    tailwind('rounded-5 flex flex-row items-center mr-3 mb-5 justify-center w-full', {
                                        'bg-primary-50 border-1.5 border-primary-100': selectedDate === item.date,
                                        'border-1.5 border-gray-400': selectedDate !== item.date,
                                    }),
                                    {
                                        width: 150,
                                        height: 70
                                    }
                                ]}
                                onPress={() => selectDate(item.date)}
                            >
                                <Text style={tailwind('text-base font-normal', {
                                    'text-slate-900': selectedDate === item.date,
                                    'text-slate-500': selectedDate !== item.date,
                                })}>
                                    {item.date}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <FlatList
                        style={[tailwind('mt-5 pb-80')]}
                        data={schedule.find((item) => item.date === selectedDate)?.timeSlots || []}
                        showsVerticalScrollIndicator={true as any}
                        keyExtractor={(item) => item.start}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={tailwind('flex flex-row items-center justify-between w-full py-1 my-1')}
                                onPress={() => selectTime(item.end)}
                            >
                                <Text style={tailwind('text-base font-normal')}>
                                    {`${item.start}-${item.end}`}
                                </Text>
                                <Checkbox style={{margin: 8, }} color={selectedTime === item.end ? getColor('primary-100') : undefined} value={selectedTime === item.end} />
                            </TouchableOpacity>
                        )}
                    />
                </View>
            </View>
        </BottomSheetModal>
    );
}

interface ModalFooterProps extends BottomSheetFooterProps {
    scheduleDate: () => void
}
const ModalFooter: React.FC<ModalFooterProps> = ({animatedFooterPosition, scheduleDate}) => {
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    const isAndroid = Device.osName === 'Android'

    return (
        <BottomSheetFooter
            style={tailwind('px-5 flex flex-row w-full')}
            animatedFooterPosition={animatedFooterPosition}
            bottomInset={bottomSafeArea}
        >
            <GenericButton
                style={tailwind('w-full', {'mb-3': isAndroid})}
                onPress={() => scheduleDate() }
                label="Choose delivery date"
                backgroundColor={tailwind('bg-primary-100')}
                labelColor={tailwind('text-white font-medium')}
            />
        </BottomSheetFooter>

    )
}

function EmptyHandleComponent(): JSX.Element {
    return <View />;
}


export const ScheduleDeliveryModal = memo(_ScheduleDeliveryModal)
