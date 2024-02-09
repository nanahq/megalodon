import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {AddressBookI} from "@nanahq/sticky";

const _DeliveryAddressBox: React.FC<{selectedAddress: AddressBookI | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-black font-bold text-lg mb-2')}>Delivery Address</Text>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-brand-ash py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <IconComponent iconType="Ionicons" name="location-sharp" style={tailwind('text-primary-500')} size={34} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('text-lg')}>{props.selectedAddress === undefined ? 'Choose delivery address' : props.selectedAddress.labelName}</Text>
                        <Text style={tailwind(' text-center text-brand-gray-700 text-sm')}>{props.selectedAddress === undefined ? 'Tap here to continue' : props.selectedAddress.address}</Text>
                    </View>
                    <IconComponent iconType="Feather" name="chevron-right" size={34} />
                </View>
            </Pressable>
        </View>
    )
}

export const DeliveryAddressBox = memo(_DeliveryAddressBox)
