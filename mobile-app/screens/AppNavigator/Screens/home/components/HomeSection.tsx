import React, {PropsWithChildren} from "react";
import {View, Text, ScrollView, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {ChevronRight} from 'lucide-react-native'
export const HomeSection: React.FC<PropsWithChildren<{label: string, onPress?: () => void}>> =(props) => {
    return (
        <ScrollView style={tailwind('mt-1 flex-1 h-full bg-white pt-2')} scrollEventThrottle={16}>
           <View style={tailwind('mb-2 flex flex-row w-full justify-between items-center')}>
               <Text style={[tailwind('text-3xl mb-2 font-bold text-slate-900')]}>{props.label}</Text>
               {props.onPress !== undefined && (
                   <Pressable onPress={props.onPress}>
                       <View style={tailwind('flex flex-row items-center')}>
                           <Text style={tailwind('text-slate-900 text-base font-medium mr-1')}>All</Text>
                           <ChevronRight style={tailwind('text-slate-900')} size={18} />
                       </View>
                   </Pressable>
               )}
           </View>
                    {props.children}
        </ScrollView>
    )

}

export const HomeSectionVertical: React.FC<PropsWithChildren<{label: string,}>> =(props) => {
    return (
        <View style={tailwind('mt-2 flex-1 w-full bg-white h-full')}>
            <View style={tailwind('mb-2')}>
                <Text style={[tailwind('font-bold text-2xl mb-2 text-slate-900')]}>{props.label}</Text>
            </View>
            <View style={tailwind('flex-1 w-full h-full')}>
                    {props.children}
            </View>
        </View>
    )

}
