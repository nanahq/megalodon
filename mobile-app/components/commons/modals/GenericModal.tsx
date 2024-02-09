import {Modal, View} from "react-native";
import React, {PropsWithChildren} from "react";
import {tailwind} from "@tailwind";

interface GenericModalProps {
    modalState: boolean
    onModalChange: (state: boolean) => void

    onModalCloseListener?: () => void
}
export const GenericModal: React.FC<PropsWithChildren<GenericModalProps>> = (props) => {
    return (
        <Modal
            animationType="slide"
            transparent={true as any}
            visible={props.modalState}
            onRequestClose={() => {
                props.onModalChange(!props.modalState);

                if (props.onModalCloseListener !== undefined) {
                    props.onModalCloseListener()
                }
            }}>
            <View style={[tailwind('absolute top-0 left-0 w-full h-full items-center flex-1 justify-center'), {
                backgroundColor: 'rgba(0, 0, 0, 0.5)',
                zIndex: 1
            }]}>
                {props.children}
            </View>
        </Modal>
    )
}
