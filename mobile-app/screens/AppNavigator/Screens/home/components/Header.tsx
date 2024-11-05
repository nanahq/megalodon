import React from "react";
import {View, Text, SafeAreaView} from "react-native";
import {IconComponent} from "@components/commons/IconComponent";
import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";
import {useLocation} from "@contexts/location.provider";
import {Locate} from 'lucide-react-native'

export const HomeHeader: React.FC<any> = () => {
    const {currentCity} = useLocation()
    return (
        <SafeAreaView style={tailwind('flex flex-row w-full bg-white px-4 items-center justify-between')}>
            <View style={tailwind('flex flex-row items-center')}>
               <Locate size={20} style={tailwind('text-slate-900')} />
                <Text style={tailwind('font-bold text-lg mx-1')}>{currentCity}</Text>
            </View>
            <IconButton iconName="filter-sharp" iconType="Ionicons" iconSize={24}  />
        </SafeAreaView>
    )
}
