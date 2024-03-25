import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {getColor, tailwind} from "@tailwind";
import Checkbox from "expo-checkbox";


const _PaymentOptionsBox: React.FC<{selectedPaymentMethod: 'BANK_TRANSFER' | 'USSD' | undefined,  onPress: (paymentType: string) => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-black font-bold text-xl mb-2')}>Payment options</Text>
            <View>
                <Pressable onPress={() => props.onPress('BANK_TRANSFER')} style={tailwind('mb-3 border-0.5 border-brand-ash py-4 px-2')}>
                    <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                        <View style={tailwind('flex flex-col')}>
                            <Text style={tailwind('text-lg capitalize')}>Bank Transfer</Text>
                            <Text style={tailwind(' text-center text-brand-gray-700 text-sm')}>You get an account details to make payment</Text>
                        </View>
                        <Checkbox style={{margin: 8}} color={props.selectedPaymentMethod === 'BANK_TRANSFER' ? getColor('primary-500') : undefined} value={props.selectedPaymentMethod === 'BANK_TRANSFER'} />
                    </View>
                </Pressable>
                <Pressable disabled={true as any} onPress={() => props.onPress('USSD')} style={tailwind('border-0.5 border-brand-ash py-4 px-2')}>
                    <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                        <View style={tailwind('flex flex-col')}>
                            <Text style={tailwind('text-lg capitalize text-brand-gray-700')}>Direct Bank Charge</Text>
                            <Text style={tailwind('text-center text-warning-500 text-sm')}>currently unavailable</Text>
                        </View>
                        <Checkbox style={{margin: 8}} color={props.selectedPaymentMethod === 'USSD' ? getColor('primary-500') : undefined} value={props.selectedPaymentMethod === 'USSD'} />
                    </View>
                </Pressable>
                <Pressable disabled={true as any} onPress={() => props.onPress('USSD')} style={tailwind('border-0.5 border-brand-ash py-4 px-2')}>
                    <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                        <View style={tailwind('flex flex-col')}>
                            <Text style={tailwind('text-lg capitalize text-brand-gray-700')}>Debit card</Text>
                            <Text style={tailwind('text-center text-warning-500 text-sm')}>currently unavailable</Text>
                        </View>
                        <Checkbox style={{margin: 8}} color={props.selectedPaymentMethod === 'USSD' ? getColor('primary-500') : undefined} value={props.selectedPaymentMethod === 'USSD'} />
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export const PaymentOptionsBox = memo(_PaymentOptionsBox)
