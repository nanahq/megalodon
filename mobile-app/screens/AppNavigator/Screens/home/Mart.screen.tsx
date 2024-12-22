import {Dimensions, ScrollView, Text, Image, View} from "react-native";
import { tailwind} from "@tailwind";
import React, {useEffect} from "react";
import {useNavigation} from "@react-navigation/native";
import {useLocation} from "@contexts/location.provider";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";

import GroceriesDp from "@assets/app-config/Groceries 2.png";

const HeaderCenter = () => (
    <View style={tailwind('flex flex-row items-center')}>
        <Image source={GroceriesDp} style={tailwind('w-48 h-24')} resizeMode="contain" width={100} height={40} />
    </View>
);

export const MartScreen: React.FC= () => {
    const {height} = Dimensions.get('window')
    const navigation = useNavigation()

    const {isWithinSupportedCities} = useLocation()

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                height: 120,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
            },
            headerTitle: () => <HeaderCenter />,
        })
    }, [])

    if(!isWithinSupportedCities) {
        return <NotfoundLocation />
    }

    return (
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={[tailwind('flex-1 bg-white pt-4 px-5'),{height}]}
            >
                <View style={tailwind('flex  flex-col items-center justify-center mt-10')}>
                    <Text style={tailwind('font-bold text-center text-2xl text-slate-900')}>Coming soon on Nana</Text>
                    <Text style={tailwind('font-normal text-base text-slate-600 text-center mt-3')}>Shop from your favourite stores and super markets right from your mobile phone and get it delivered to your doorstep</Text>
                </View>
            </ScrollView>

    )
}
