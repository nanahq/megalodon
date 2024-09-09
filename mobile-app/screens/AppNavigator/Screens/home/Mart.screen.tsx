import {Dimensions, ScrollView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {SafeAreaView} from "react-native-safe-area-context";
import {IconButton} from "@components/commons/buttons/IconButton";
import {SearchBar} from "@screens/AppNavigator/Screens/home/components/SearchBar";
import React from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageStores from "@assets/ads/groceries_shop.png";
export const MartScreen: React.FC= () => {
    const {height} = Dimensions.get('window')
    return (
        <View style={tailwind('flex-1 bg-white pt-4 px-5')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height,}}
            >
                <SearchBar />
                <AdvertComponent source={AdImageStores} />
                <View style={tailwind('flex  flex-col items-center justify-center mt-10')}>
                    <Text style={tailwind('font-bold text-center text-xl')}>Coming soon on Nana</Text>
                    <Text style={tailwind('font-medium text-sm text-gray-600 text-center mt-3')}>Shop from your favourite stores and super markets right from your mobile phone.</Text>
                </View>
            </ScrollView>
        </View>

    )
}
