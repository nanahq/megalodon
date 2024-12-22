import {Dimensions, Image, View, Text, Pressable} from "react-native";
import React, {useEffect} from "react";
import {getColor, tailwind} from "@tailwind";
import {useAnalytics} from "@segment/analytics-react-native";
import {CartIcon} from "@screens/AppNavigator/Screens/home/components/CartIcon";
import {useNavigation} from "@react-navigation/native";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
import {useLocation} from "@contexts/location.provider";
import {MapPin, User} from 'lucide-react-native'
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {useCart} from "@contexts/cart.provider";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {useProfile} from "@contexts/profile.provider";
import {CategorySection} from "@screens/AppNavigator/Screens/modals/components/Tags";
import AdvertImage from '@assets/ads/ad-food.png'
import Logo from '@assets/app-config/nana-logo.jpg'
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
const {height} = Dimensions.get('window')

const HeaderLeft = ({ currentCity, navigation }) => (
    <View style={tailwind('flex py-5 flex-row items-center ml-5 w-4/5')}>
        <Text style={tailwind('font-light text-xs text-slate-900')}>{currentCity.substring(0, 40)}</Text>
    </View>
);

const HeaderCenter = () => (
    <View style={tailwind('flex flex-row items-center py-5')}>
        <Image source={Logo} style={tailwind('w-28 h-14')} resizeMode="contain" width={100} height={40} />
    </View>
);
const HeaderRight = ({ navigation }) => (
    <Pressable
        style={tailwind('bg-primary-100 my-5 mr-5 border-2 border-primary-100 rounded-full p-2')}
        onPress={() => navigation?.navigate(AppScreenName.PROFILE)}
    >
        <User size={20} color={getColor('black')} />
    </Pressable>
);

export function HomeScreen(): JSX.Element {
    const {isWithinSupportedCities, currentCity} = useLocation()
    const {cart} = useCart()
    const {profile} = useProfile()
    const navigation = useNavigation()
    const analytics = useAnalytics()

    useEffect(() => {
        void analytics.screen(HomeScreenName.HOME)
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
            headerLeft: () => <HeaderLeft currentCity={currentCity} navigation={navigation} />,
            headerRight: () => <HeaderRight navigation={navigation} />,
        })
    }, [navigation, currentCity])

    if(!isWithinSupportedCities) {
        return <NotfoundLocation />
    }

    return (
        <View style={tailwind('flex-1 relative bg-white')}>
            {/* <AdvertMiniComponent */}
            {/*     source={AdvertImage1} */}
            {/*     height={100} */}
            {/* /> */}
            <View style={[ {height}]}>
                <View style={tailwind('px-5')}>
                    <CategorySection />
                </View>
                <AdvertComponent source={AdvertImage} />
            </View>
            {cart?.hasItemsInCart && <CartIcon/>}
        </View>
    )
}
