import React, {memo} from "react";
import {Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {OrderStatus} from "@nanahq/sticky";

const _OrderView: React.FC<{onButtonClick: (name: string) => void, view: OrderStatus, }>  = ({ onButtonClick, view}) => {
    return (
        <View style={tailwind('my-4 flex flex-col')}>
            <View style={tailwind('bg-brand-ash p-2 rounded-40')}>
                <View style={tailwind('flex flex-row overflow-hidden items-center justify-between w-full')}>
                    <Pressable onPress={() => onButtonClick(OrderStatus.PAYMENT_PENDING)} style={tailwind('rounded-40 py-2 px-12', {'bg-primary-500 ': view === OrderStatus.PAYMENT_PENDING})}>
                        <Text style={tailwind(' text-white text-lg', {'text-brand-gray-700':view === OrderStatus.FULFILLED })}>Ongoing</Text>
                    </Pressable>
                    <Pressable onPress={() => onButtonClick("DELIVERED_TO_CUSTOMER")} style={tailwind('rounded-40 py-2 px-12', {'bg-primary-500 ': view === OrderStatus.FULFILLED})}>
                        <Text style={tailwind(' text-white text-lg', {'text-brand-gray-700':view === OrderStatus.PAYMENT_PENDING })}>Completed</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export const OrderView = memo(_OrderView)
