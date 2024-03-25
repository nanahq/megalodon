import React from "react";
import {View, Text} from "react-native";
import {IconComponent} from "@components/commons/IconComponent";
import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";

export const HomeHeader: React.FC<any> = () => {
    return (
        <View style={tailwind('flex flex-row w-full bg-white px-4 items-center justify-between')}>
            <View style={tailwind('flex flex-row items-center')}>
                <IconComponent iconType="Ionicons" name="ios-location-outline" size={16} />
                <Text style={tailwind('font-bold text-lg mx-1')}>Kano</Text>
            </View>
            <IconButton iconName="filter-sharp" iconType="Ionicons" iconSize={24}  />
        </View>
    )
}
