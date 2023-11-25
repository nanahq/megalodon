import {Text, View} from "react-native";
import React, {PropsWithChildren} from "react";
import {tailwind} from "@tailwind";

interface Props {
    heading: string
}
export function DeliveryInfo ({children, heading}: PropsWithChildren<Props>) {
    return (
        <View style={tailwind('mb-4')}>
            <Text style={tailwind('text-primary-500 font-bold text-2xl')}>{heading}</Text>
            <View style={tailwind('flex flex-col')}>
                {children}
            </View>
        </View>
    )
}

const DeliveryInfoItem: React.FC<{title: string, info: string}>  = (props) => {
    return (
        <View style={tailwind('flex py-3 flex-col w-full border-b-0.5 border-brand-gray-700 mb-2')}>
            <Text style={tailwind('text-sm mb-2 text-brand-gray-700')}>{props.title}</Text>
            <Text>{props.info}</Text>
        </View>
    )
}


DeliveryInfo.Item = DeliveryInfoItem