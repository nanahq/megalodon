import {View, Text, Image, Dimensions, ImageBackground, ScrollView} from 'react-native'
import {tailwind} from "@tailwind";
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import {useLogger} from "@contexts/NativeLoggingProvider";
// import {GenericButton, GenericButtonLink} from "@components/commons/buttons/GenericButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {OnboardingCarousel} from "@screens/OnboardingNavigator/screens/components/OnboardingCarosel";
export function OnboardingScreen (): JSX.Element {
    const navigator = useNavigation<NavigationProp<OnboardingParamsList>>()
    const logger = useLogger()
    const { top: topInset } = useSafeAreaInsets();
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync().catch(logger.error);
        });
    }, []);

    return (
        <ScrollView
            contentContainerStyle={{ paddingTop: topInset + 120, paddingBottom: 40 }}
            style={tailwind("bg-white")}
            testID="onboarding_carousel"
        >
            <View style={tailwind("flex-1")}>
                <OnboardingCarousel />
            </View>
        </ScrollView>
    )
}
