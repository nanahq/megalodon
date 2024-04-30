import {
    LinkingOptions,
    NavigationContainer,
    NavigationContainerRef,
} from "@react-navigation/native";

import { createStackNavigator } from "@react-navigation/stack";

import * as Linking from "expo-linking";
import {useRef} from "react";
import {EnterPhoneNumberScreen} from "@screens/OnboardingNavigator/screens/authentication/EnterPhoneNumber.screen";
import {EnterPasswordScreen} from "@screens/OnboardingNavigator/screens/authentication/EnterPassword.Screen";
import {VerifyPhoneNumberScreen} from "@screens/OnboardingNavigator/screens/authentication/VerifyPhoneNumber.screen";
import {OnboardingScreen} from "./screens/Onboarding.screen";
import {OnboardingScreenName} from "./ScreenName.enum";
import {GuestAppNavigator} from "@screens/GuestNavigator/AppNav";

export interface OnboardingParamsList {
    [OnboardingScreenName.ENTER_PASSWORD]: {
        phoneNumber: string
        hasAccount: boolean
        firstName?: string | undefined
    }

    [OnboardingScreenName.VERIFY_PHONE_NUMBER]: {
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
    function OnboardingStacks (): JSX.Element {
        return (
            <OnboardingStack.Navigator
                initialRouteName={OnboardingScreenName.ONBOARDING}
                screenOptions={{
                      headerShown: false
                    }}
            >
                <OnboardingStack.Screen
                    component={OnboardingScreen}
                    name={OnboardingScreenName.ONBOARDING}
                    options={{
                        headerShown: false
                    }}
                />
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
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={GuestAppNavigator}
                    name={'ONBOARDING_GUEST'}
                    options={{
                        headerShown: false
                    }}
                />
                <OnboardingStack.Screen
                    component={VerifyPhoneNumberScreen}
                    name={OnboardingScreenName.VERIFY_PHONE_NUMBER}
                    options={{
                        headerShown: false
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
