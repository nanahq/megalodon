import {Pressable, StyleProp, TextStyle, ViewStyle} from "react-native";
import {getColor, tailwind} from "@tailwind";
import React from "react";
import {ArrowLeft} from "lucide-react-native";

export const ModalCloseIcon: React.FC<{onPress: () => void, size?: number,buttonStyle?: StyleProp<ViewStyle>, iconStyle?: StyleProp<TextStyle>}> = (props) => {
    return (
        <Pressable onPress={props.onPress} style={props.buttonStyle}>
            <ArrowLeft color={getColor('slate-900')} size={props.size ?? 34} style={[tailwind('mx-4 font-bold'), props.iconStyle]}/>
        </Pressable>
    )
}

export const ModalBackIcon: React.FC<{onPress: () => void, size?: number,buttonStyle?: StyleProp<ViewStyle>, iconStyle?: StyleProp<TextStyle>}> = (props) => {
    return (
        <Pressable onPress={props.onPress} style={props.buttonStyle}>
            <ArrowLeft color="#000000" size={props.size ?? 40} style={[tailwind('mx-4 font-bold'), props.iconStyle]}/>
        </Pressable>
    )
}
