import React, { RefObject, useCallback} from "react";
import {tailwind} from "@tailwind";
import {View, Text, TouchableOpacity, ScrollView, Pressable, Image} from "react-native";
import * as Device from 'expo-device'
import SendCourier from "@assets/app/send-courier.png";
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps,
    BottomSheetFooter,
    BottomSheetFooterProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {AddressLabelI, DeliveryFeeResult} from "@nanahq/sticky";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {IconComponent} from "@components/commons/IconComponent";
import {CircleX} from "lucide-react-native";
import {useAddress} from "@contexts/address-book.provider";
import {NumericFormat as NumberFormat} from "react-number-format";


type CourierModalProps = {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    onDismiss?: () => void
    deliveryFee?: DeliveryFeeResult
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

export function CourierModal(props: CourierModalProps): JSX.Element {
    const { dismiss } = useBottomSheetModal();

    const getSnapPoints = (): string[] => {

        return ["50%"]
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
                    onAddNewAddress={() => {
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
            <ScrollView style={tailwind('bg-white rounded-t-3xl px-5 pt-10 flex-1')}>
                <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                    <Text style={tailwind('text-lg font-semibold text-slate-900')}>Delivery Fee</Text>
                    <TouchableOpacity onPress={closeModal}>
                        <CircleX style={[tailwind('text-slate-900')]} size={32} />
                    </TouchableOpacity>
                </View>
                <Pressable style={tailwind('mt-5 border-1.5 bg-primary-50 border-primary-100 rounded-lg py-4 px-3')}>
                    <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                        <View>
                            <Image
                                source={SendCourier}
                                width={60}
                                height={60}
                                style={{width: 60, height: 60}}
                                resizeMode="contain"
                            />
                        </View>
                        <View style={tailwind('flex flex-col items-center')}>
                            <View style={tailwind('flex bg-nana-yellow rounded-xl p-1')}>
                                <Text style={tailwind('text-xs')}>Express Delivery</Text>
                            </View>
                            <Text style={tailwind('text-xs')}>{props.deliveryFee?.duration} mins</Text>
                        </View>
                        <NumberFormat
                            prefix="₦ "
                            value={props?.deliveryFee?.fee}
                            thousandSeparator
                            displayType="text"
                            renderText={(value) => (
                                <Text style={tailwind("font-normal text-xl")}>{value}</Text>
                            )}
                        />
                    </View>
                </Pressable>
            </ScrollView>
        </BottomSheetModal>
    );
}

interface ModalFooterProps extends BottomSheetFooterProps {
    onAddNewAddress: () => void
}

const ModalFooter: React.FC<ModalFooterProps> = ({animatedFooterPosition, onAddNewAddress}) => {
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
                onPress={() => onAddNewAddress() }
                label="Proceed"
                labelColor={tailwind('text-white')}
            />
        </BottomSheetFooter>
    )
}

function EmptyHandleComponent(): JSX.Element {
    return <View />;
}
