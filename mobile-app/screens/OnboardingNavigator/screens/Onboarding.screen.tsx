import {View, Text, ImageBackground} from 'react-native'
import {tailwind} from "@tailwind";
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import {useLogger} from "@contexts/NativeLoggingProvider";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import AppLogo from '@assets/app/nana-logo.png'
import OnboardingCorouselImage from '@assets/onboarding/onboarding_image_4.png'
import { LinearGradient } from "expo-linear-gradient";
import FastImage from "react-native-fast-image";

export function OnboardingScreen (): JSX.Element {
    const navigator = useNavigation<NavigationProp<OnboardingParamsList>>()
    const logger = useLogger()

    // Hide splashscreen when first page is loaded to prevent white screen
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync().catch(logger.error);
        });
    }, []);
    return (
        <View
            style={tailwind('flex flex-col flex-1 bg-white')}
            testID="OnboardingScreen.View"
        >
            <ImageBackground
                source={OnboardingCorouselImage}
                resizeMode="cover"
                style={tailwind('flex-1')}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.6)', 'rgba(0,0,0,0)']} // Adjust the overlay color and opacity here
                    style={tailwind('absolute top-0 left-0 right-0 bottom-0')}
                />
                <View style={tailwind('w-full flex-1 mt-16 ')}>
                    <View style={tailwind('flex flex-col flex-grow w-full px-4')}>
                        <FastImage
                            source={AppLogo}
                            resizeMode="contain"
                            style={[tailwind('flex flex-row justify-start'), {width: 200, aspectRatio: 1}]}
                        />
                        <View style={tailwind('flex flex-col')}>
                            <Text numberOfLines={2} style={tailwind('text-2xl font-bold text-white')}>Order food and get it delivered in</Text>
                            <Text style={tailwind('text-white text-3xl font-bold')}>Minutes!</Text>
                        </View>
                    </View>

                    <View style={tailwind('flex-1 mt-10 bg-black bg-opacity-20 px-4 pt-10 rounded-t-lg')}>
                        <Text style={tailwind('text-2xl text-white font-bold text-center')}>Login or sign up to get started</Text>
                        <GenericButton
                            style={tailwind('mt-5')}
                            onPress={() => navigator.navigate(OnboardingScreenName.ENTER_MOBILE_PHONE)}
                            label="Get started"
                            labelColor={tailwind('text-white text-2xl font-normal')}
                            backgroundColor={tailwind('bg-black')}
                            testId="GenericButton.Onboarding.Continue"
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
