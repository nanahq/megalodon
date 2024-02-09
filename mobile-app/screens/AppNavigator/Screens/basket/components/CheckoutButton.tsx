import React, {memo} from "react";
import {Text, Pressable, View} from "react-native";
import {tailwind} from "@tailwind";
import { VendorOperationType} from "@nanahq/sticky";

const _CheckoutButton: React.FC<{onButtonClick: (name: VendorOperationType) => void, view: VendorOperationType, vendorType: VendorOperationType}>  = ({vendorType, onButtonClick, view}) => {
    return (
       <View style={tailwind('mt-4 flex flex-col')}>
           {vendorType !== 'PRE_AND_INSTANT' && (
               <Text style={tailwind('text-sm text-center mb-3 text-brand-gray-700')}>This Restaurant only accepts { vendorType === 'ON_DEMAND' ? 'instant orders' : 'pre-orders'}</Text>
           )}
           <View style={tailwind('bg-brand-ash p-2 rounded-40')}>
               <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                   <Pressable  disabled={vendorType === 'PRE_ORDER'} onPress={() => onButtonClick("ON_DEMAND")} style={tailwind(' rounded-40 py-2 px-12', {'bg-primary-500 text-white': view === 'ON_DEMAND'})}>
                       <Text style={tailwind('text-base', {'text-white': view === 'ON_DEMAND'})}>Deliver Now</Text>
                   </Pressable>
                   <Pressable disabled={vendorType === 'ON_DEMAND'} onPress={() => onButtonClick("PRE_ORDER")} style={tailwind('text-lg rounded-40 py-2 px-12', {'bg-primary-500 text-white': view === 'PRE_ORDER'})}>
                       <Text style={tailwind('text-base', {'text-white': view === 'PRE_ORDER'})}>Pre Order</Text>
                   </Pressable>
               </View>
           </View>
       </View>
    )
}

 export const CheckoutButton = memo(_CheckoutButton)
