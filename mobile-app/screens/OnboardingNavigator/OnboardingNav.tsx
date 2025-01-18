import {
    LinkingOptions,
    NavigationContainer,
    NavigationContainerRef,
} from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import * as Linking from "expo-linking";
import {useRef, useEffect} from "react";
import {EnterPhoneNumberScreen} from "@screens/OnboardingNavigator/screens/authentication/EnterPhoneNumber.screen";
import {EnterPasswordScreen} from "@screens/OnboardingNavigator/screens/authentication/EnterPassword.Screen";
import {VerifyPhoneNumberScreen} from "@screens/OnboardingNavigator/screens/authentication/VerifyPhoneNumber.screen";
import {OnboardingScreenName} from "./ScreenName.enum";
import * as SplashScreen from "expo-splash-screen";
import {useLogger} from "@contexts/NativeLoggingProvider";
export interface OnboardingParamsList {
    [OnboardingScreenName.ENTER_PASSWORD]: {
        phoneNumber: string
        hasAccount: boolean
        firstName?: string | undefined
    }

    [OnboardingScreenName.VERIFY_PHONE_NUMBER]: {
        pinId: string,
        phoneNumber: string
    }

    [key: string]: undefined | object;
}

const OnboardingStack = createStackNavigator<OnboardingParamsList>();

const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [Linking.createURL("/")],
    config: {
        screens: {
            [OnboardingScreenName.ONBOARDING]: "onboarding/landing",
            [OnboardingScreenName.ENTER_MOBILE_PHONE]: "onboarding/enter/phone",
            [OnboardingScreenName.ENTER_PASSWORD]: "onboarding/enter/password",
            [OnboardingScreenName.VERIFY_PHONE_NUMBER]: "onboarding/verify/phone",
            [OnboardingScreenName.FORGET_PASSWORD]: "onboarding/retrieve/password",
        },
    },
};


export function OnboardingNagivator (): JSX.Element {
    const navigationRef = useRef<NavigationContainerRef<ReactNavigation.RootParamList>>(null)
    const logger = useLogger()
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync().catch(logger.error);
        });
    }, []);

    function OnboardingStacks (): JSX.Element {
        return (
            <OnboardingStack.Navigator
                initialRouteName={OnboardingScreenName.ENTER_MOBILE_PHONE}
                screenOptions={{
                      headerShown: false
                    }}
            >
                <OnboardingStack.Screen
                    component={EnterPhoneNumberScreen}
                    name={OnboardingScreenName.ENTER_MOBILE_PHONE}
                    options={{
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={EnterPasswordScreen}
                    name={OnboardingScreenName.ENTER_PASSWORD}
                    options={{
                        headerShown: true
                    }}
                />
                <OnboardingStack.Screen
                    component={VerifyPhoneNumberScreen}
                    name={OnboardingScreenName.VERIFY_PHONE_NUMBER}
                    options={{
                        headerShown: true
                    }}
                />

            </OnboardingStack.Navigator>
        )
    }

    return (
        <NavigationContainer
            linking={LinkingConfiguration}
            ref={navigationRef}
        >
            <OnboardingStacks />
        </NavigationContainer>
    )
}
