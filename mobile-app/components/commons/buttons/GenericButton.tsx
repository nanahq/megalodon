import {StyleProp, Text, TextProps, TouchableOpacity, TouchableOpacityProps, View} from "react-native";
import {tailwind} from "@tailwind";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import React, {PropsWithChildren} from "react";

interface  GenericButtonProps {
    disabled?: boolean
    onPress: () => void,
    label: string
    style?: StyleProp<any>
    backgroundColor?: StyleProp<TouchableOpacityProps>
    labelColor?: StyleProp<TextProps>
    testId?: string
    loading?: boolean
}

export interface GenericIconButtonProps  {
    label?: string
    disabled?: boolean
    onPress: () => void,
    style?: StyleProp<any>
    backgroundColor?: StyleProp<TouchableOpacityProps>
    labelColor?: StyleProp<TextProps>
    testId?: string
    loading?: boolean
}

type Props = GenericButtonProps & TouchableOpacity["props"]


export function GenericButton (props: Props): JSX.Element {
    const {
        backgroundColor,
        label,
        style,
        ...rest
    } = props
    const activeOpacity = 0.7
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            style={[ tailwind('rounded-xl', {
                'bg-gray-700': props.disabled || props.loading,
            }), style, tailwind('bg-primary-100 py-4'), backgroundColor, {
                shadowColor: 'rgba(0,0,0, .4)', // IOS
                shadowOffset: { height: 1, width: 1 }, // IOS
                shadowOpacity: 1, // IOS
                shadowRadius: 1, //IOS
                elevation: 10, // Android
            }]}
            {...rest}
        >
            <Text style={[tailwind('text-center text-base font-semibold'), props.labelColor as any] }>{label} {props.loading !== undefined && props.loading && <LoaderComponent loaderColor="white" size={16} style={tailwind('pl-2 text-white')} />}</Text>
        </TouchableOpacity>
    )
}

export function GenericButtonLink (props: Props): JSX.Element {
    const {
        label,
        style,
        ...rest
    } = props
    const activeOpacity = 0.7
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            style={[tailwind('underline'), style]}
            {...rest}
        >
            <Text style={[tailwind('text-center text-lg py-1'), props.labelColor as any] }>{label}</Text>
            {props.loading !== undefined && props.loading && <LoaderComponent loaderColor="white" size='small' style={tailwind('pl-2 text-white')} />}
        </TouchableOpacity>
    )
}
export const GenericIconButton: React.FC<PropsWithChildren<GenericIconButtonProps>> = (props) => {
    const {
        backgroundColor,
        labelColor,
        style,
        ...rest
    } = props
    const activeOpacity = 0.7
    return (
        <TouchableOpacity
            activeOpacity={activeOpacity}
            style={[backgroundColor as any, tailwind('rounded-xl', {
                'bg-slate-100': props.disabled,
                'flex flex-row justify-center w-full items-center': props.loading
            }), style, tailwind('bg-primary-100')]}
            {...rest}
        >
           <View
               style={tailwind('flex  flex-row items-center justify-center py-3.5')}
           >
               {props.children}
           </View>
        </TouchableOpacity>
    )
}
