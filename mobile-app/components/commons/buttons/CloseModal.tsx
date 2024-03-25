import {StyleProp, TextStyle, View} from 'react-native'
import {tailwind} from '@tailwind'
import {useBottomSheetModal} from "@gorhom/bottom-sheet";
import {IconButton} from "@components/commons/buttons/IconButton";

interface CloseModalProps {
    modalName: string
    iconStyle?: StyleProp<TextStyle>
}
export function CloseModalButton (props: CloseModalProps): JSX.Element {
    const { dismiss } = useBottomSheetModal()

    function closeModal () {
        dismiss(props.modalName)
    }
    return (
        <View  style={tailwind('flex flex-row w-full items-center justify-end')}>
            <IconButton
                onPress={closeModal}
                iconName='x-circle'
                iconType='Feather'
                iconSize={20}
                iconStyle={[tailwind(''), props.iconStyle]}
            />
        </View>
    )
}
