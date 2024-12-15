import React from "react";
import {AddressBookI} from "@nanahq/sticky";
import {Pressable, Text, View} from "react-native";
import {ChevronRight, MapPin} from "lucide-react-native";
import {tailwind} from '@tailwind'
export const BoxDeliveryAddressBox: React.FC<{defaultText: string, selectedAddress: AddressBookI | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-slate-200 py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <MapPin style={tailwind('text-primary-100')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('font-normal text-slate-900 text-sm')}>{props.selectedAddress === undefined ? props.defaultText : props.selectedAddress.address}</Text>
                    </View>
                    <ChevronRight  size={20} style={tailwind('text-gray-500')} />
                </View>
            </Pressable>
        </View>
    )
}
