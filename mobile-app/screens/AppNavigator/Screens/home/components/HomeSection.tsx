import React, {PropsWithChildren} from "react";
import {View, Text, ScrollView, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {ChevronRight} from 'lucide-react-native'
export const HomeSection: React.FC<PropsWithChildren<{label: string, onPress?: () => void}>> =(props) => {
    return (
        <View style={tailwind('bg-white flex-1 mt-3 pt-2 border-b-0.5 border-slate-200')}>
            <View style={tailwind('mb-2 flex flex-row mb-4 w-full justify-between items-center')}>
                <Text style={[tailwind('text-lg  font-semibold text-slate-900')]}>{props.label}</Text>
                {props.onPress !== undefined && (
                    <Pressable onPress={props.onPress}>
                        <View style={tailwind('flex flex-row items-center')}>
                            <Text style={tailwind('text-slate-900 text-sm font-light mr-1')}>View all</Text>
                            <ChevronRight style={tailwind('text-slate-900')} size={18} />
                        </View>
                    </Pressable>
                )}
            </View>
            <View style={tailwind('flex-1 h-full')}>
                {props.children}
            </View>
        </View>
    )

}

export const HomeSectionVertical: React.FC<PropsWithChildren<{label: string,}>> =(props) => {
    return (
        <View style={tailwind('mt-2 flex-1 w-full bg-white h-full')}>
            <View style={tailwind('mb-2')}>
                <Text style={[tailwind('font-semibold text-lg mb-2 text-slate-900')]}>{props.label}</Text>
            </View>
            <View style={tailwind('flex-1 w-full h-full')}>
                    {props.children}
            </View>
        </View>
    )

}
