import {Text, View} from "react-native";
import React, {PropsWithChildren} from "react";
import {tailwind} from "@tailwind";

interface Props {
}
export function DeliveryInfo ({children}: PropsWithChildren<Props>) {
    return (
        <View style={tailwind('mb-4')}>
            <View style={tailwind('flex flex-col')}>
                {children}
            </View>
        </View>
    )
}

const DeliveryInfoItem: React.FC<{title: string, info: string}>  = (props) => {
    return (
        <View style={tailwind('flex py-3 flex-col w-full border-b-0.5 border-brand-gray-700 mb-2')}>
            <Text style={tailwind('text-sm mb-2 text-white')}>{props.title}</Text>
            <Text style={tailwind('text-white')}>{props.info}</Text>
        </View>
    )
}


DeliveryInfo.Item = DeliveryInfoItem
