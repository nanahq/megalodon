import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {NumericFormat as NumberFormat} from "react-number-format";
import {Info} from 'lucide-react-native'
const _CheckoutBreakDown: React.FC<{onPress?: () => void, label: string, value: number | string, subTotal?: boolean }> = (props) => {
    return (
        <View style={tailwind('flex flex-row items-center justify-between w-full mb-2', {'mt-2 border-t-0.5 border-slate-200 pt-2': props.subTotal})}>
           <View style={tailwind('flex flex-row items-center')}>
               <Text style={tailwind('text-slate-900 font-normal text-base capitalize', {'font-bold': props.subTotal})}>
                   {props.label}
               </Text>
               {props.onPress && (<Pressable onPress={props.onPress} style={tailwind('ml-2')}><Info style={tailwind('text-slate-600')} size={14} /></Pressable>)}
           </View>
            <NumberFormat
                prefix="₦"
                value={props.value}
                thousandSeparator
                displayType="text"
                renderText={(value) => (
                    <Text style={tailwind("text-base text-slate-900 font-normal", {'font-semibold': props.subTotal})}>{value}</Text>
                )}
            />
        </View>
    )
}

export const CheckoutBreakDown = memo(_CheckoutBreakDown)
