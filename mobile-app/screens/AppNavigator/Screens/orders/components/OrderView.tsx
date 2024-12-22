import React, {memo} from "react";
import {Dimensions, Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {OrderStatus} from "@nanahq/sticky";

const _OrderView: React.FC<{onButtonClick: (name: string) => void, view: OrderStatus, }>  = ({ onButtonClick, view}) => {
    const {width: screenWidth} = Dimensions.get('window')
    return (
        <View style={tailwind('mt-2 flex flex-col')}>

            <View style={tailwind('bg-gray-100 p-2 rounded-lg')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <Pressable onPress={() => onButtonClick(OrderStatus.PAYMENT_PENDING)} style={[tailwind('rounded-lg py-2 px-12', {'bg-white': view !== OrderStatus.FULFILLED}), {width: (screenWidth - 50) / 2}]}>
                        <Text style={tailwind('text-base text-slate-900 font-medium text-center', {'text-primary-100': view !== OrderStatus.FULFILLED})}>Active</Text>
                    </Pressable>
                    <Pressable onPress={() => onButtonClick(OrderStatus.FULFILLED)} style={[tailwind(' rounded-lg py-2 px-12', {'bg-white': view === OrderStatus.FULFILLED}), {width: (screenWidth - 50) / 2}]}>
                        <Text style={tailwind('text-base text-center text-slate-900 font-medium', {'text-primary-100': view === OrderStatus.FULFILLED})}>Delivered</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}

export const OrderView = memo(_OrderView)
