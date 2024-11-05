import {Dimensions, Pressable, ScrollView, Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {SearchBar} from "@screens/AppNavigator/Screens/home/SearchBar";
import React from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageStores from "@assets/ads/groceries_shop.png";
import {useNavigation} from "@react-navigation/native";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {User} from "lucide-react-native";
import {useLocation} from "@contexts/location.provider";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
export const MartScreen: React.FC= () => {
    const {height} = Dimensions.get('window')
    const insert = useSafeAreaInsets()
    const navigation = useNavigation()

    const {isWithinSupportedCities} = useLocation()

    if(!isWithinSupportedCities) {
        return <NotfoundLocation />
    }

    return (
        <SafeAreaView style={tailwind('flex-1 bg-white pt-4 px-5')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height,}}
            >
                <AdvertComponent source={AdImageStores} />
                <View style={tailwind('flex  flex-col items-center justify-center mt-10')}>
                    <Text style={tailwind('font-bold text-center text-2xl text-slate-900')}>Coming soon on Nana</Text>
                    <Text style={tailwind('font-normal text-base text-slate-600 text-center mt-3')}>Shop from your favourite stores and super markets right from your mobile phone and get it delivered to your doorstep</Text>
                </View>
            </ScrollView>
        </SafeAreaView>

    )
}
