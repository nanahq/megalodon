import React, {memo, RefObject, useCallback, useState} from "react";
import {getColor, tailwind} from "@tailwind";
import {Pressable, Text, TouchableOpacity, View,} from "react-native";
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
import {GenericButton} from "@components/commons/buttons/GenericButton";
import Checkbox from "expo-checkbox";
import {PaymentMethodI} from "@screens/AppNavigator/Screens/basket/components/payment/PaymentMethodBox";
import {IconComponent} from "@components/commons/IconComponent";
import {CircleX, CreditCard, Wallet} from "lucide-react-native";

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
        return ["50%"];
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
            footerComponent={({animatedFooterPosition}) => (
                <ModalFooter selectedMethod={props.selectedPaymentMethod?.name} animatedFooterPosition={animatedFooterPosition} scheduleDate={() => {
                    closeModal()
                }} />
            )}
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
                    <Text style={tailwind('text-lg font-semibold text-slate-900')}>How do you want to pay?</Text>
                    <TouchableOpacity onPress={closeModal}>
                        <CircleX style={[tailwind('text-gray-400')]} size={32} />
                    </TouchableOpacity>
                </View>
                <View style={tailwind('flex-col mt-4')}>
                    <TouchableOpacity onPress={() => onValueChange('ONLINE')} style={tailwind("flex flex-row mb-2 px-2 items-center justify-between py-3")}>
                        <View style={tailwind("flex flex-col")}>
                            <View style={tailwind('flex flex-row items-center')}>
                                <View style={tailwind('flex flex-row items-center')}>
                                    <CreditCard
                                        style={tailwind('text-slate-900')}
                                        size={20}
                                    />
                                    <Text style={tailwind("ml-2 text-slate-900 text-base font-normal")}>Pay online</Text>
                                </View>
                            </View>
                            <Text style={tailwind("text-slate-500 text-sm font-normal")}>Using card, bank transfer, ussd</Text>
                        </View>
                        <Checkbox
                            style={[{margin: 8}, tailwind('rounded-full')]}
                            color={selection === 'ONLINE' ? getColor('primary-100') : undefined}
                            value={selection === 'ONLINE'}
                        />
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => onValueChange('WALLET')} disabled={true as any} style={tailwind("flex flex-row  items-center justify-between py-3 mt-2")}>
                        <View style={tailwind("flex flex-col")}>
                            <View style={tailwind('flex flex-row items-center')}>
                                <Wallet
                                    style={tailwind('text-slate-900')}
                                    size={20}
                                />
                                <Text style={tailwind("ml-2 text-slate-900 text-base font-normal")}>Pay with wallet balance</Text>
                            </View>
                            <Text style={tailwind('text-nana-yellow text-sm font-normal')}>Coming soon</Text>
                        </View>
                        <Checkbox
                            style={[{margin: 8}, tailwind('rounded-full')]}
                            color={selection === 'WALLET' ? getColor('primary-100') : undefined}
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
const ModalFooter: React.FC<ModalFooterProps> = ({animatedFooterPosition, scheduleDate, selectedMethod}) => {
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
                label={selectedMethod?.includes("WALLET") ? "Pay using wallet" : selectedMethod?.includes("ONLINE") ? "Pay online" : "Choose payment method"}
                backgroundColor={tailwind('bg-primary-100')}
                labelColor={tailwind('text-white font-medium')}
            />
        </BottomSheetFooter>

    )
}

function EmptyHandleComponent(): JSX.Element {
    return <View />;
}


export const PaymentMethodModal = memo(_PaymentMethodModal)
