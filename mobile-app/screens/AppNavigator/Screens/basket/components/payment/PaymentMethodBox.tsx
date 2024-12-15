import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {HandCoins, ChevronRight} from "lucide-react-native";

export interface PaymentMethodI {
    name: "PAY_ONLINE" | "PAY_BY_WALLET" ,
    label: string
    useWalletBalance: boolean
}
const _PaymentMethodBox: React.FC<{selectedMethod: PaymentMethodI | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-base text-slate-900 font-normal mb-2')}>How do you want to pay?
                <Text style={tailwind('text-xs font-normal text-slate-500')}>   *required</Text>
            </Text>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-slate-200 py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <HandCoins  style={tailwind('text-primary-100')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('font-normal text-sm text-slate-900')}>{props.selectedMethod === undefined ? 'Choose payment method' : props.selectedMethod.label}</Text>
                    </View>
                    <ChevronRight  style={tailwind('text-gray-500')} size={20} />
                </View>
            </Pressable>
        </View>
    )
}

export const PaymentMethodBox = memo(_PaymentMethodBox)
