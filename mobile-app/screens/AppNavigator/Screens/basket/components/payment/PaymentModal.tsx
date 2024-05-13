import React, {memo, RefObject, useCallback, useState} from "react";
import {getColor, tailwind} from "@tailwind";
import {Text, TouchableOpacity, View,} from "react-native";
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
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import Checkbox from "expo-checkbox";
import {PaymentMethodI} from "@screens/AppNavigator/Screens/basket/components/payment/PaymentMethodBox";
import {IconComponent} from "@components/commons/IconComponent";

interface PaymentMethodModalProps {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    onDismiss?: () => void
    selectedPaymentMethod: PaymentMethodI | undefined

    setSelectedPaymentMethod: (p: PaymentMethodI) => void
}


const _PaymentMethodModal:React.FC<PaymentMethodModalProps> = (props) => {
    const [selection, setSelection] = useState<string | undefined>(props.selectedPaymentMethod?.name)
    const { dismiss } = useBottomSheetModal();
    const getSnapPoints = (): string[] => {
        return ["50%", "70%"];
    }

    const closeModal = useCallback(() => {
        dismiss(props.promptModalName);
    }, []);


    const onValueChange = (name: string) => {
        if (name === 'ONLINE') {
            props?.setSelectedPaymentMethod({
                name: "PAY_ONLINE" ,
                label: 'Pay Online',
                useWalletBalance: false
            })
        } else {
            props?.setSelectedPaymentMethod({
                name: "PAY_BY_WALLET" ,
                label: 'Pay with wallet balance',
                useWalletBalance: false
            })
        }
        setSelection(name)
    }

    return (
        <BottomSheetModal
            enableContentPanningGesture
            onDismiss={props.onDismiss}
            enableHandlePanningGesture
            handleComponent={EmptyHandleComponent}
            enablePanDownToClose

            footerComponent={({animatedFooterPosition}) => (
                <ModalFooter animatedFooterPosition={animatedFooterPosition} scheduleDate={() => {
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
                <View style={tailwind('flex flex-row w-full justify-between items-center mb-10')}>
                    <Text style={tailwind('font-bold text-xl')}>Available payment methods</Text>
                    <ModalCloseIcon onPress={() => closeModal()} size={32} />
                </View>
                <View style={tailwind('flex-col mt-4')}>
                    <TouchableOpacity onPress={() => onValueChange('ONLINE')} style={tailwind("flex flex-row border-0.5 border-gray-200 px-2 items-center justify-between py-3")}>
                        <View style={tailwind("flex flex-col")}>
                            <View style={tailwind('flex flex-row items-center')}>
                                <IconComponent
                                    iconType="AntDesign"
                                    name="creditcard"
                                    style={tailwind('text-brand-black-500')}
                                    size={20}
                                />
                               <View style={tailwind('flex flex-col')}>
                                   <Text style={tailwind("ml-2 text-lg text-brand-black-500")}>Pay online</Text>
                                   <Text style={tailwind("ml-2 text-xs text-gray-500")}>Using card, bank transfer, ussd</Text>
                               </View>
                            </View>
                        </View>
                        <Checkbox
                            style={[{margin: 8}, tailwind('rounded-full')]}
                            color={selection === 'ONLINE' ? getColor('brand-black-500') : undefined}
                            value={selection === 'ONLINE'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onValueChange('WALLET')} disabled={true as any} style={tailwind("flex flex-row border-0.5 border-gray-200 px-2 items-center justify-between py-3 mt-2")}>
                        <View style={tailwind("flex flex-col")}>
                            <View style={tailwind('flex flex-row items-center')}>
                                <IconComponent
                                    iconType="AntDesign"
                                    name="wallet"
                                    style={tailwind('text-brand-black-500')}
                                    size={20}
                                />
                                <Text style={tailwind("ml-2 text-lg text-gray-500")}>Pay with wallet balance</Text>
                            </View>
                            <Text style={tailwind('text-warning-500 text-xs')}>Coming soon</Text>
                        </View>
                        <Checkbox
                            style={[{margin: 8}, tailwind('rounded-full')]}
                            color={selection === 'WALLET' ? getColor('brand-black-500') : undefined}
                            value={selection === 'WALLET'}
                        />
                    </TouchableOpacity>
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
                label="Choose payment method"
                backgroundColor={tailwind('bg-black')}
                labelColor={tailwind('text-white font-medium')}
            />
        </BottomSheetFooter>

    )
}

function EmptyHandleComponent(): JSX.Element {
    return <View />;
}


export const PaymentMethodModal = memo(_PaymentMethodModal)
