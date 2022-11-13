import {View, Text} from 'react-native'
import {tailwind} from "@tailwind";
import * as SplashScreen from 'expo-splash-screen'
import {useEffect} from 'react'
import {useLogger} from "@contexts/NativeLoggingProvider";
import {ScrolledView} from "@components/views/ScrolledView";
import {OnboardingCarousel} from "./components/OnboardingCarosel";
import {GenericButton} from "@components/commons/buttons/GenericButton";


export function OnboardingScreen (): JSX.Element {
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
        contentContainerStyle={{overflow: 'hidden'}}
       >
            <OnboardingCarousel />
           <View style={[tailwind('bg-primary-500 flex w-full py-8 px-12'), {height: 160}]}>
               <Text style={tailwind('font-semibold text-white text-center text-xl')}>Login or Signup with EatLater</Text>
                <GenericButton
                    onClick={() => {}}
                    label="Continue"
                    labelColor={tailwind('text-white')}
                    backgroundColor={tailwind('bg-brand-black-500')}
                    style={tailwind('mt-4')}
                    testId="GenericButton.Onboarding.Continue"
                />
           </View>
       </ScrolledView>
    )
}
