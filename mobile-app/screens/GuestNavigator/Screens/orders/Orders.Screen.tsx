import { View} from "react-native";
import React, {useEffect} from "react";
import {tailwind} from "@tailwind";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {useNavigation} from "@react-navigation/native";

export const OrderScreen: React.FC = () => {
    const navigation = useNavigation()
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Orders`,
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
                    onPress={() => undefined}
                    label="Login to view orders"
                />
            </View>
        </View>
    )
}

