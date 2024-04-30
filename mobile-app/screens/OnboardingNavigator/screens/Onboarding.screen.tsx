import {View, Text, Image, Dimensions, ImageBackground} from 'react-native'
import {tailwind} from "@tailwind";
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import {useLogger} from "@contexts/NativeLoggingProvider";
import {GenericButton, GenericButtonLink} from "@components/commons/buttons/GenericButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {OnboardingCarousel} from "@screens/OnboardingNavigator/screens/components/OnboardingCarosel";
import OnboardingCover from '@assets/onboarding/COVER_2.png'
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {LinearGradient} from "expo-linear-gradient";
import OnboardingCoverImage from '@assets/onboarding/onboarding_image_4.png'
import NanaIcon from '@assets/onboarding/nana_logo_White.png'
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
            style={tailwind('flex flex-col w-full flex-1 bg-white')}
            testID="OnboardingScreen.View"
        >
            <ImageBackground
                source={OnboardingCoverImage}
                contentFit="cover"
                style={tailwind('flex-1')}
            >
                <LinearGradient
                    colors={['rgba(0,0,0,0.8)', 'rgba(0,0,0,0.5)']} // Adjust the overlay color and opacity here
                    style={tailwind('absolute top-0 left-0 right-0 bottom-0')}
                />
                <View style={tailwind('flex-1 justify-end w-full px-3')}>
                    <View style={tailwind('mb-5')}>
                      <View style={{width: 150, height:75}}>
                          <Image
                              source={NanaIcon}
                              resizeMode="contain"
                              style={{width: 150, height:75}}
                          />
                      </View>
                        <Text style={tailwind('mt-4 text-gray-100 text-3xl text-gray-200')}>Super fast Food and Groceries delivery</Text>
                    </View>
                    <View style={tailwind('w-full bg-gray-100 h-0.5')} />
                    <View style={tailwind('flex flex-col mt-14 justify-center items-center mb-10')}>
                        <GenericButton
                            style={tailwind('mb-1')}
                            labelColor={tailwind('text-white')}
                            onPress={() => navigator.navigate<any>(OnboardingScreenName.ENTER_MOBILE_PHONE)}
                            label="Get Started"
                            backgroundColor={tailwind('bg-primary-100 w-full')}
                        />
                    </View>
                </View>
            </ImageBackground>
        </View>
    )
}
