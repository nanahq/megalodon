import React, { RefObject, useCallback} from "react";
import {tailwind} from "@tailwind";
import {View, Text, Pressable} from "react-native";
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {IconButton} from "@components/commons/buttons/IconButton";


type AddMoneyModalProps =   {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    onDismiss?: () => void

    accountNumber: string

}


export const AddMoneyModal: React.FC<AddMoneyModalProps> = (props) => {
    const { dismiss } = useBottomSheetModal();
    const getSnapPoints = (): string[] => {
        return ["40%"]
    }


    const closeModal = useCallback(() => {
        dismiss(props.promptModalName);
    }, []);

    return (
        <BottomSheetModal
            enableContentPanningGesture
            onDismiss={props.onDismiss}
            enableHandlePanningGesture
            handleHeight={2}
            handleComponent={EmptyHandleComponent}
            enablePanDownToClose
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
                    style={tailwind('bg-brand-blue-200')}
                />
            )}
        >
            <View style={tailwind('bg-white px-4 pt-3 flex-1')}>
                <View style={tailwind('flex flex-row py-2 border-b-0.5 border-gray-500 w-full justify-between items-center')}>
                    <Text style={tailwind('font-bold text-2xl')}>Payment method</Text>
                    <ModalCloseIcon
                        iconStyle={tailwind('mx-0.5')}
                        buttonStyle={[tailwind('bg-gray-200 rounded-full flex flex-row items-center justify-center p-0 m-0'), {width: 40, height: 40}]} onPress={() => closeModal()} size={20} />
                </View>
                <View style={tailwind('flex flex-col mt-2')}>
                    <Pressable style={tailwind('py-2 mb-1.5 border-b-0.5 border-gray-200')}>
                        <Text style={tailwind('text-lg text-gray-600')}>Fund wallet online</Text>
                    </Pressable>
                    <Pressable style={tailwind('py-2  mb-1.5 flex flex-row items-center justify-between w-full ')}>
                        <View style={tailwind('flex flex-col')}>
                            <Text style={tailwind('text-lg text-gray-600')}>Fund with wallet account number</Text>
                            <View style={tailwind('bg-nana-lime w-2/3 justify-center py-1 rounded-lg flex flex-row items-center')}>
                                <Text style={tailwind('text-xs text-white')}>{props.accountNumber}</Text>
                                <Text style={tailwind('text-xs text-white')}> | Paystack-Titan</Text>
                            </View>
                        </View>
                        <IconButton iconName="copy" iconType="Feather"  iconStyle={tailwind('text-gray-600')} iconSize={16} />
                    </Pressable>
                    <Pressable style={tailwind('py-2  mb-1.5 border-t-0.5 border-gray-200')}>
                        <Text style={tailwind('text-lg text-gray-600')}>Redeem Gift Card</Text>
                    </Pressable>
                </View>
            </View>
        </BottomSheetModal>
    );
}


function EmptyHandleComponent(): JSX.Element {
    return <View />;
}
