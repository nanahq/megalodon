import {StyleProp, Text, TextProps, TouchableOpacity, TouchableOpacityProps} from "react-native";
import {tailwind} from "@tailwind";
import {LoaderComponent} from "@components/commons/LoaderComponent";

interface  GenericButtonProps {
    onPress: () => void,
    label: string
    style?: StyleProp<TouchableOpacityProps>
    backgroundColor: StyleProp<TouchableOpacityProps>
    labelColor?: StyleProp<TextProps>
    testId: string
    loading?: boolean
}


type Props = GenericButtonProps & TouchableOpacity["props"]


export function GenericButton (props: Props): JSX.Element {
    const {
        backgroundColor,
        label,
        labelColor,
        style,
        ...rest
    } = props
    const activeOpacity = 0.7
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            style={[backgroundColor as any, tailwind('rounded-xl', {
                'bg-brand-gray-700': props.disabled,
                'flex flex-row justify-center w-full items-center bg-brand-gray-700': props.loading
            }), style]}
            {...rest}
        >
            <Text style={[tailwind('font-semibold text-center text-lg py-3.5'), labelColor]}>{label}</Text>
            {props.loading !== undefined && props.loading && <LoaderComponent size='small' style={tailwind('pl-2 text-white')} />}
        </TouchableOpacity>
    )
}
