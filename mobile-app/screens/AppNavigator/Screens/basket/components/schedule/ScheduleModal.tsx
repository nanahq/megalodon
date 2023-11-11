import React, {memo, RefObject, useCallback, useEffect, useMemo, useState} from "react";
import {getColor, tailwind} from "@tailwind";
import {FlatList, Text, TouchableOpacity, View,} from "react-native";
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
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import moment from 'moment'
import Checkbox from "expo-checkbox";
import {formatRelativeDate} from "../../../../../../../utils/DateFormatter";

type ScheduleDeliveryProps =   {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    onDismiss?: () => void
    vendor: VendorUserI

    onScheduleSet: (time:{time: string, date: string}) => void
    startDate?: string;

}

interface TimeSlot {
    start: string;
    end: string;
}

interface ScheduleItem {
    date: string;
    timeSlots: TimeSlot[];
}

 const _ScheduleDeliveryModal:React.FC<ScheduleDeliveryProps> = (props) => {
    const { dismiss } = useBottomSheetModal();
    const  operations  = props.vendor?.settings as VendorOperationSetting
    const [selectedDate, setSelectedDate] = useState<string >(operations?.startTime ?? '');
    const [selectedTime, setSelectedTime] = useState<string>(operations?.cutoffTime ?? '');
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

    const startDate = useMemo(() => {
        return props.startDate ?? moment()
    }, [props.startDate])


    const generateSchedule = () => {
        const schedules: ScheduleItem[] = [];
        let currentDate = moment(startDate);

        while (currentDate.isSameOrBefore(moment(startDate).add(3, 'days'))) {
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

         while (currentTime.isBefore(endTime) && !currentTime.isSameOrAfter(endTime)) {
             timeSlots.push({
                 start: currentTime.format('HH:mm'),
                 end: currentTime.add(45, 'minutes').format('HH:mm'),
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

    const getSnapPoints = (): string[] => {
        if (Device.osName === "iOS") {
            return ["80%"];
        } else if (Device.osName === "Android") {
            return ["80%"];
        }
        return [];
    }

    const closeModal = useCallback(() => {
        dismiss(props.promptModalName);
    }, []);



    return (
        <BottomSheetModal
            enableContentPanningGesture
            onDismiss={props.onDismiss}
            enableHandlePanningGesture
            handleComponent={EmptyHandleComponent}
            enablePanDownToClose
            footerComponent={({animatedFooterPosition}) => (
                <ModalFooter animatedFooterPosition={animatedFooterPosition} scheduleDate={() => {
                    props.onScheduleSet({
                        time: selectedTime,
                        date: selectedDate
                    })
                    closeModal()
                }} />
            )}
            onChange={(index) => {
                if (index === 1) {
                    closeModal()
                }
            }}
            name={props.promptModalName}
            ref={props.modalRef}
            snapPoints={getSnapPoints()}
            backdropComponent={(backdropProps: BottomSheetBackdropProps) => (
                <View
                    {...backdropProps}
                    style={[backdropProps.style, tailwind("bg-black bg-opacity-60")]}
                />
            )}
            backgroundComponent={(backgroundProps: BottomSheetBackgroundProps) => (
                <View
                    {...backgroundProps}
                    style={tailwind('bg-brand-blue-200 rounded-t-xl')}
                />
            )}
        >
            <View style={tailwind('bg-white rounded-t-3xl px-5 pt-10 flex-1')}>
                <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                    <Text style={tailwind('font-bold text-3xl')}>Schedule Delivery</Text>
                    <ModalCloseIcon onPress={() => closeModal()} size={32} />
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
                                    tailwind('rounded-5 flex flex-row items-center mr-3 justify-center w-full', {
                                        'border-1.5 border-black': selectedDate === item.date,
                                        'border-1.5 border-brand-gray-700': selectedDate !== item.date,
                                    }),
                                    {
                                        width: 150,
                                        height: 70
                                    }
                                ]}
                                onPress={() => selectDate(item.date)}
                            >
                                <Text style={tailwind('text-lg capitalize', {
                                    'text-black': selectedDate === item.date,
                                    'text-brand-gray-700': selectedDate !== item.date,
                                })}>
                                    {item.date}
                                </Text>
                            </TouchableOpacity>
                        )}
                    />
                    <FlatList
                        style={[tailwind('mt-4'), {maxHeight: 400}]}
                        data={schedule.find((item) => item.date === selectedDate)?.timeSlots || []}
                        showsVerticalScrollIndicator={false}
                        keyExtractor={(item) => item.start}
                        renderItem={({ item }) => (
                            <TouchableOpacity
                                style={tailwind('flex flex-row items-center justify-between w-full py-2.5 my-1')}
                                onPress={() => selectTime(item.end)}
                            >
                                <Text style={tailwind('text-lg')}>
                                    {`${item.start}-${item.end}`}
                                </Text>
                                <Checkbox style={{margin: 8}} color={selectedTime === item.end ? getColor('brand-black-500') : undefined} value={selectedTime === item.end} />
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
                label="Schedule"
                backgroundColor={tailwind('bg-black')}
                labelColor={tailwind('text-white font-medium')}
            />
        </BottomSheetFooter>

    )
}

function EmptyHandleComponent(): JSX.Element {
    return <View />;
}


export const ScheduleDeliveryModal = memo(_ScheduleDeliveryModal)
