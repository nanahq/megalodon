import { View} from "react-native";
import {tailwind} from "@tailwind";
import React, {useEffect} from "react";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {useNavigation} from "@react-navigation/native";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

export const ProfileScreen = () => {
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Profile`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            presentation: 'modal',
            cardShadowEnabled: true,
            cardOverlayEnabled: true,
            animationEnabled: true,
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        });
    })
    return (
        <View style={tailwind('flex-1 bg-white px-4')}>
            <View style={tailwind('mt-20')}>
                <GenericButton
                    labelColor={tailwind('text-white')}
                    onPress={() => navigation.navigate<any>(OnboardingScreenName.ONBOARDING, {screen: OnboardingScreenName.ENTER_MOBILE_PHONE})}
                    label="Login"
                />
            </View>
        </View>
    )
}


