import React from "react";
import {View,Text} from "react-native";
import {tailwind} from "@tailwind";

export const ProfileAvatar: React.FC<{initials: string}> = (props) => {
    return (
        <View style={[tailwind('bg-slate-100 rounded-full flex flex-row items-center justify-center'), {width: 65, height: 65}]}>
            <Text style={tailwind('text-2xl font-bold text-lg')}>{props.initials}</Text>
        </View>
    )
}
