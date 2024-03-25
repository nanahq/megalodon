import React, {memo} from "react";
import {View, Text} from "react-native";
import {tailwind} from "@tailwind";
import {NumericFormat as NumberFormat} from "react-number-format";

const _CheckoutBreakDown: React.FC<{label: string, value: number | string, subTotal?: boolean }> = (props) => {
    return (
        <View style={tailwind('flex flex-row items-center justify-between w-full mb-2', {'mt-2 border-t-0.5 border-gray-500 pt-2': props.subTotal})}>
            <Text style={tailwind('text-black text-base capitalize', {'font-bold': props.subTotal})}>{props.label}</Text>
            <NumberFormat
                prefix="₦"
                value={props.value}
                thousandSeparator
                displayType="text"
                renderText={(value) => (
                    <Text style={tailwind("text-base", {'font-bold': props.subTotal})}>{value}</Text>
                )}
            />
        </View>
    )
}

export const CheckoutBreakDown = memo(_CheckoutBreakDown)
