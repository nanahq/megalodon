import React, {PropsWithChildren} from "react";
import {View, Text, ScrollView} from "react-native";
import {tailwind} from "@tailwind";

export const HomeSection: React.FC<PropsWithChildren<{label: string}>> =(props) => {
    return (
        <ScrollView style={tailwind('mt-4 flex-1 bg-white px-4 py-6')} scrollEventThrottle={16}>
           <View style={tailwind('mb-3')}>
               <Text style={tailwind('text-2xl font-bold text-black')}>{props.label}</Text>
           </View>
            <View style={{height: 205}}>
                <ScrollView
                    horizontal={true as any}
                    showsHorizontalScrollIndicator={false}
                >
                    {props.children}
                </ScrollView>
            </View>
        </ScrollView>
    )

}
