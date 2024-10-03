import React, {memo} from "react";
import {Dimensions, Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {OrderStatus} from "@nanahq/sticky";

const _OrderView: React.FC<{onButtonClick: (name: string) => void, view: OrderStatus, }>  = ({ onButtonClick, view}) => {
   const {width: screenWidth} = Dimensions.get('window')
    return (
        <View style={tailwind('my-2 flex flex-col')}>
            <View style={tailwind('bg-gray-100  rounded-lg overflow-hidden flex flex-row items-center justify-between overflow-hidden p-2')}>
                    <Pressable onPress={() => onButtonClick(OrderStatus.PAYMENT_PENDING)} style={[tailwind('rounded-lg py-2 px-12', {'bg-primary-100': view === OrderStatus.PAYMENT_PENDING}), {width: (screenWidth - 50) / 2}]}>
                        <Text style={tailwind(' text-white', {'text-brand-gray-700':view === OrderStatus.FULFILLED })}>Ongoing</Text>
                    </Pressable>
                    <Pressable onPress={() => onButtonClick(OrderStatus.FULFILLED)} style={[tailwind('rounded-lg py-2 px-12', {'bg-primary-100': view === OrderStatus.FULFILLED}), {width: (screenWidth - 50) / 2}]}>
                        <Text style={tailwind(' text-white', {'text-brand-gray-700':view === OrderStatus.PAYMENT_PENDING })}>Completed</Text>
                    </Pressable>
            </View>
        </View>
    )
}

export const OrderView = memo(_OrderView)
