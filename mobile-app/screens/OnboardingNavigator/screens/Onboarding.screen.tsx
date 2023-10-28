import {View, Text} from 'react-native'
import {tailwind} from "@tailwind";
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import {useLogger} from "@contexts/NativeLoggingProvider";
import {ScrolledView} from "@components/views/ScrolledView";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {OnboardingCarousel} from "./components/OnboardingCarosel";

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
       <ScrolledView
        testId="OnboardingScreen.View"
        style={{backgroundColor: '#ffffff'}}
        contentContainerStyle={{overflow: 'hidden'}}
       >
            <OnboardingCarousel />
           <View style={tailwind('bg-white flex w-full pt-8 pb-12 px-12')}>
               <View>
                   <Text style={tailwind('font-semibold text-black text-center text-2xl')}>Order Food And More</Text>
                   <Text style={tailwind('font-medium text-black text-center text-lg')}>Login or Signup with Nana</Text>
               </View>
                <GenericButton
                    onPress={() => navigator.navigate(OnboardingScreenName.ENTER_MOBILE_PHONE)}
                    label="Continue"
                    labelColor={tailwind('text-white')}
                    backgroundColor={tailwind('bg-black')}
                    style={tailwind('mt-4 border-2 border-white')}
                    testId="GenericButton.Onboarding.Continue"
                />
           </View>
       </ScrolledView>
    )
}
