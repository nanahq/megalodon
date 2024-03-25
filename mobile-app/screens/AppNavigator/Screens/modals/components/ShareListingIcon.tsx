import {Pressable} from "react-native";
import {IconComponent} from "@components/commons/IconComponent";
import {tailwind} from "@tailwind";
import React from "react";

export const ShareListingIcon: React.FC<{onPress: () => void}> = (props) => {
    return (
        <Pressable onPress={props.onPress}>
            <IconComponent iconType="Feather" name="share" size={20} style={tailwind('mx-4 font-medium')}/>
        </Pressable>
    )
}
