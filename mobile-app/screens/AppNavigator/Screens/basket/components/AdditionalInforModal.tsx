import React, {memo, PropsWithChildren, RefObject, useCallback} from "react";
import { tailwind} from "@tailwind";
import {Pressable, View,} from "react-native";
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
const CustomBackdrop = ({ animatedIndex, style, ...props }: BottomSheetBackdropProps) => {
    const { dismiss } = useBottomSheetModal();
    return (
        <Pressable
            onPress={() => dismiss()}
            style={[
                style,
                tailwind("absolute inset-0 bg-black bg-opacity-40")
            ]}
            {...props}
        />
    );
};


interface PaymentMethodModalProps {

}


const _AdditionalInfoModal:React.FC<PropsWithChildren<{   modalRef: RefObject<BottomSheetModalMethods>, promptModalName: string, onDismiss?: () => void}>> = (props) => {
    const { dismiss } = useBottomSheetModal();
    const getSnapPoints = (): string[] => {
        return ["25%"];
    }

    const closeModal = useCallback(() => {
        dismiss(props.promptModalName);
    }, []);
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
            onDismiss={props?.onDismiss}
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
            <View style={tailwind('bg-white rounded-t-3xl px-5 py-8 flex-1')}>
                {props.children}
            </View>
        </BottomSheetModal>
    );
}



export const AdditionalInfoModal = memo(_AdditionalInfoModal)
