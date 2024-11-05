import {Dimensions, Pressable, ScrollView, Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import React from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageCourier from "@assets/ads/courier.png";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {User} from "lucide-react-native";
import {SearchBar} from "@screens/AppNavigator/Screens/home/SearchBar";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
import {useLocation} from "@contexts/location.provider";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
export const CourierScreen: React.FC = () => {
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
                style={{height}}
            >
                <AdvertComponent source={AdImageCourier} />
                <View style={tailwind('flex  flex-col items-center justify-center mt-10')}>
                    <Text style={tailwind('font-bold text-center text-slate-900 text-2xl')}>Coming soon on Nana</Text>
                    <Text style={tailwind('font-normal text-base text-slate-600 text-center mt-3')}>Send or receive a package  hassle free. Our courier partners with deliver with 100% guarantee.</Text>
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}
