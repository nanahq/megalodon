import {View, Text, Image, Dimensions} from 'react-native'
import {tailwind} from "@tailwind";
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import {useLogger} from "@contexts/NativeLoggingProvider";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {OnboardingCarousel} from "@screens/OnboardingNavigator/screens/components/OnboardingCarosel";
import OnboardingCover from '@assets/onboarding/COVER_2.png'
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

export function OnboardingScreen (): JSX.Element {
    const navigator = useNavigation<NavigationProp<OnboardingParamsList>>()
    const logger = useLogger()
    const { top: topInset } = useSafeAreaInsets();
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync().catch(logger.error);
        });
    }, []);

    const {width, height} = Dimensions.get('window')
    return (
        <View
            style={tailwind("flex-1")}
            testID="onboarding_carousel"
        >
            <View style={tailwind("flex-1")}>
               <Image
                resizeMode="cover"
                style={{width, height}}
                source={OnboardingCover}
               />
            </View>
            <View style={tailwind('px-8 flex flex-col')}>
                <View style={tailwind("flex flex-col items-center justify-center w-full")}>
                    <Text style={tailwind('text-black mb-3 font-bold text-3xl')}>Welcome to Nana</Text>
                    <Text style={tailwind('text-center text-gray-600 text-lg')}>Nana = Delivered! Enjoy the best food or what you need nearby, delivered.</Text>
                </View>
               <GenericButton
                   style={tailwind('mt-14 mb-8')}
                   labelColor={tailwind('text-white')}
                   onPress={() => navigator.navigate(OnboardingScreenName.ENTER_MOBILE_PHONE)}
                   label="Get Started"
                   backgroundColor={tailwind('bg-primary-100')}
               />
            </View>
        </View>
    )
}
