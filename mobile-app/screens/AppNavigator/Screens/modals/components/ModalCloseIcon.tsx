import {Pressable, StyleProp, TextStyle, ViewStyle} from "react-native";
import {IconComponent} from "@components/commons/IconComponent";
import {tailwind} from "@tailwind";
import React from "react";

export const ModalCloseIcon: React.FC<{onPress: () => void, size?: number,buttonStyle?: StyleProp<ViewStyle>, iconStyle?: StyleProp<TextStyle>}> = (props) => {
    return (
        <Pressable onPress={props.onPress} style={props.buttonStyle}>
            <IconComponent iconType="AntDesign" name="arrowleft" size={props.size ?? 34} style={[tailwind('mx-4 font-bold'), props.iconStyle]}/>
        </Pressable>
    )
}

export const ModalBackIcon: React.FC<{onPress: () => void, size?: number,buttonStyle?: StyleProp<ViewStyle>, iconStyle?: StyleProp<TextStyle>}> = (props) => {
    return (
        <Pressable onPress={props.onPress} style={props.buttonStyle}>
            <IconComponent iconType="AntDesign" name="arrowleft" size={props.size ?? 40} style={[tailwind('mx-4 font-bold'), props.iconStyle]}/>
        </Pressable>
    )
}
