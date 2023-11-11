import {Pressable} from "react-native";
import {IconComponent} from "@components/commons/IconComponent";
import {tailwind} from "@tailwind";
import React from "react";

export const ModalCloseIcon: React.FC<{onPress: () => void, size?: number}> = (props) => {
    return (
        <Pressable onPress={props.onPress}>
            <IconComponent iconType="AntDesign" name="close" size={props.size ?? 20} style={tailwind('mx-4 font-medium')}/>
        </Pressable>
    )
}
