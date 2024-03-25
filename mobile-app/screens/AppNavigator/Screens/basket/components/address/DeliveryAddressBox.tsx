import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {AddressBookI} from "@nanahq/sticky";

const _DeliveryAddressBox: React.FC<{selectedAddress: AddressBookI | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-black mb-2')}>Delivery Address</Text>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-brand-ash py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <IconComponent iconType="Ionicons" name="location-sharp" style={tailwind('text-black')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('')}>{props.selectedAddress === undefined ? 'Choose delivery address' : props.selectedAddress.labelName}</Text>
                    </View>
                    <IconComponent iconType="Feather" name="chevron-right" size={20} style={tailwind('text-gray-500')} />
                </View>
            </Pressable>
        </View>
    )
}

export const DeliveryAddressBox = memo(_DeliveryAddressBox)
