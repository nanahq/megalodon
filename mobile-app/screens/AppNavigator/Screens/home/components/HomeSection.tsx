import React, {PropsWithChildren} from "react";
import {View, Text, ScrollView} from "react-native";
import {tailwind} from "@tailwind";

export const HomeSection: React.FC<PropsWithChildren<{label: string}>> =(props) => {
    return (
        <ScrollView style={tailwind('mt-3 flex-1 h-full bg-white pt-2')} scrollEventThrottle={16}>
           <View style={tailwind('mb-2')}>
               <Text style={[tailwind('text-xl'), {color: "#4c5270"}]}>{props.label}</Text>
           </View>
                    {props.children}
        </ScrollView>
    )

}

export const HomeSectionVertical: React.FC<PropsWithChildren<{label: string,}>> =(props) => {
    return (
        <View style={tailwind('mt-2 flex-1 w-full bg-white h-full')}>
            <View style={tailwind('mb-2')}>
                <Text style={[tailwind('text-xl'), {color: "#4c5270"}]}>{props.label}</Text>
            </View>
            <View style={tailwind('flex-1 w-full h-full')}>
                    {props.children}
            </View>
        </View>
    )

}
