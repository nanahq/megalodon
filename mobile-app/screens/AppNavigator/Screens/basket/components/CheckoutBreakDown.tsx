import React, {memo} from "react";
import {View, Text} from "react-native";
import {tailwind} from "@tailwind";
import {NumericFormat as NumberFormat} from "react-number-format";

const _CheckoutBreakDown: React.FC<{label: string, value: number | string }> = (props) => {
    return (
        <View style={tailwind('flex flex-row items-center justify-between w-full mb-2')}>
            <Text style={tailwind('text-brand-gray-text-500 text-base capitalize')}>{props.label}</Text>
            <NumberFormat
                prefix="₦"
                value={props.value}
                thousandSeparator
                displayType="text"
                renderText={(value) => (
                    <Text style={tailwind("text-base")}>{value}</Text>
                )}
            />
        </View>
    )
}

export const CheckoutBreakDown = memo(_CheckoutBreakDown)
