import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";

export interface PaymentMethodI {
    name: "WALLET" | "ONLINE" ,
    label: string

    useWalletBalance: boolean
}
const _PaymentMethodBox: React.FC<{selectedMethod: PaymentMethodI | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-black mb-2')}>Payment method</Text>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-brand-ash py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <IconComponent iconType="AntDesign" name="wallet" style={tailwind('text-black')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('')}>{props.selectedMethod === undefined ? 'Choose payment method' : props.selectedMethod.label}</Text>
                    </View>
                    <IconComponent iconType="Feather" name="chevron-right" style={tailwind('text-gray-500')} size={20} />
                </View>
            </Pressable>
        </View>
    )
}

export const PaymentMethodBox = memo(_PaymentMethodBox)
