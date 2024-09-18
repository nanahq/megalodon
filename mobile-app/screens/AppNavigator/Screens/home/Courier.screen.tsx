import {Dimensions, Pressable, ScrollView, Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import React from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageCourier from "@assets/ads/courier.png";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {User} from "lucide-react-native";
import {SearchBar} from "@screens/AppNavigator/Screens/home/components/SearchBar";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useNavigation} from "@react-navigation/native";
export const CourierScreen: React.FC = () => {
    const {height} = Dimensions.get('window')
    const insert = useSafeAreaInsets()
    const navigation = useNavigation()

    return (
        <View style={tailwind('flex-1 bg-white pt-4 px-5')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height}}
            >
                <View style={[tailwind('flex flex-row items-center justify-between '), {marginTop: insert.top + (insert.top * 0.2)}]}>
                    <View>
                        <Text style={tailwind('text-sm text-gray-500')}>Deliver now</Text>
                        <Text style={tailwind('text-lg font-bold')}>Kano, Nigeria</Text>
                    </View>
                    <Pressable style={tailwind('bg-gray-100 rounded-full p-2.5')} onPress={() => navigation?.navigate(AppScreenName.PROFILE)}>
                        <User
                            size={24}
                            color={getColor('black')}
                        />
                    </Pressable>
                </View>
                <SearchBar />
                <AdvertComponent source={AdImageCourier} />
                <View style={tailwind('flex  flex-col items-center justify-center mt-10')}>
                    <Text style={tailwind('font-bold text-center text-xl')}>Coming soon on Nana</Text>
                    <Text style={tailwind('font-medium text-sm text-gray-600 text-center mt-3')}>Send or receive a package with ease hassle free. Our courier partners with deliver with 100% guarantee.</Text>
                </View>
            </ScrollView>
        </View>
    )
}
