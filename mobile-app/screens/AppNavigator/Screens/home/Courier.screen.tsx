import {Dimensions, ScrollView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import React from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageCourier from "@assets/ads/courier.png";
export const CourierScreen: React.FC = () => {
    const {height} = Dimensions.get('window')
    return (
        <View style={tailwind('flex-1 bg-white pt-4 px-5')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height}}
            >
                <AdvertComponent source={AdImageCourier} />
                <View style={tailwind('flex  flex-col items-center justify-center mt-10')}>
                    <Text style={tailwind('font-bold text-center text-xl')}>Coming soon on Nana</Text>
                    <Text style={tailwind('font-medium text-sm text-gray-600 text-center mt-3')}>Send or receive a package with ease hassle free. Our courier partners with deliver with 100% guarantee.</Text>
                </View>
            </ScrollView>
        </View>
    )
}
