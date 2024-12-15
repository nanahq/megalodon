import {Dimensions, ScrollView, View, Text, Pressable} from "react-native";
import React, {useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {getColor, tailwind} from "@tailwind";
import {useAnalytics} from "@segment/analytics-react-native";
import {CartIcon} from "@screens/AppNavigator/Screens/home/components/CartIcon";
import {useNavigation} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
import {useLocation} from "@contexts/location.provider";
import {MapPin, User} from 'lucide-react-native'
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {useCart} from "@contexts/cart.provider";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {useProfile} from "@contexts/profile.provider";
import {CategorySection} from "@screens/AppNavigator/Screens/modals/components/Tags";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import HomepageAdvert from '@assets/ads/free-delivery.png'
const {height} = Dimensions.get('window')
export function HomeScreen (): JSX.Element {
    const {isWithinSupportedCities, currentCity} = useLocation()
    const { cart } = useCart()
    const {profile} = useProfile()
    const navigation = useNavigation()
    const analytics = useAnalytics()
    useEffect(() => {
        void analytics.screen(HomeScreenName.HOME)
    }, [])


    if(!isWithinSupportedCities) {
        return <NotfoundLocation />
    }


    return (
        <SafeAreaView
            style={tailwind('flex-1 relative bg-white pt-4')}
        >
            <StatusBar style={tailwind('bg-primary-100 h-full w-full')} backgroundColor={getColor('primary-100')} />
            <View style={tailwind('px-5 pb-5 flex flex-col w-full ')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <View style={tailwind('flex flex-row items-center')}>
                        <MapPin size={16} style={tailwind('text-slate-900 text-primary-100')} />
                        <Text style={tailwind('font-light text-sm text-slate-900')}>{currentCity}</Text>
                    </View>
                    <Pressable style={tailwind('bg-gray-50 border-2 border-slate-600 rounded-full p-2')} onPress={() => navigation?.navigate(AppScreenName.PROFILE)}>
                        <User
                            size={20}
                            color={getColor('slate-900')}
                        />
                    </Pressable>
                </View>
                <View>
                    <Text style={tailwind('font-semibold text-xl')}>Hello {profile?.firstName}</Text>
                </View>
            </View>
            <View
                style={[tailwind('px-5'), {height}]}
            >
                <CategorySection />
            </View>
            {cart?.hasItemsInCart && (
                <CartIcon/>
            )}
        </SafeAreaView>

    )
}
