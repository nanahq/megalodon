import React, {memo} from "react";
import {Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {OrderStatus} from "@nanahq/sticky";

const _OrderView: React.FC<{onButtonClick: (name: string) => void, view: OrderStatus, }>  = ({ onButtonClick, view}) => {
    return (
        <View style={tailwind('my-4 flex flex-col')}>
            <View style={tailwind('bg-gray-100 p-2 rounded-lg')}>
                <View style={tailwind('flex flex-row overflow-hidden items-center w-full')}>
                    <Pressable onPress={() => onButtonClick(OrderStatus.PAYMENT_PENDING)} style={tailwind('rounded-lg py-2 px-12', {'bg-primary-500': view === OrderStatus.PAYMENT_PENDING})}>
                        <Text style={tailwind(' text-white text-lg', {'text-brand-gray-700':view === OrderStatus.FULFILLED })}>Ongoing</Text>
                    </Pressable>
                    <Pressable onPress={() => onButtonClick(OrderStatus.FULFILLED)} style={tailwind('rounded-lg py-2 px-12', {'bg-primary-500': view === OrderStatus.FULFILLED})}>
                        <Text style={tailwind(' text-white text-lg', {'text-brand-gray-700':view === OrderStatus.PAYMENT_PENDING })}>Completed</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export const OrderView = memo(_OrderView)
