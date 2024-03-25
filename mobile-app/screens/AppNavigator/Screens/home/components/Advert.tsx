import { Pressable, View} from "react-native";
import {tailwind} from "@tailwind";
import React,  {PropsWithChildren} from "react";

export const HomepageAdvert: React.FC<PropsWithChildren<{onClick?: () => void}>> = ({children, onClick}) => {
    return (
        <View style={tailwind('w-full flex flex-row px-4')}>
            <Pressable onPress={onClick}>
                {children}
            </Pressable>
        </View>
    )
}
