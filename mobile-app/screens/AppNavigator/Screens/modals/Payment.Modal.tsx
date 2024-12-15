import React, { useEffect } from 'react';
import { StackScreenProps} from '@react-navigation/stack';
import { AppParamList } from '@screens/AppNavigator/AppNav';
import { ModalScreenName} from '@screens/AppNavigator/ScreenName.enum';
import { tailwind } from '@tailwind';
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import { WebView } from 'react-native-webview';
import {useAnalytics} from "@segment/analytics-react-native";
import {View} from "react-native";

type PaymentModalProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_PAYMENT_SCREEN>;

export const PaymentModal: React.FC<PaymentModalProps> = ({ navigation, route }) => {
    const analytics = useAnalytics()
    useEffect(() => {
        void analytics.screen(ModalScreenName.MODAL_PAYMENT_SCREEN)
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Payment for your order`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl font-bold  text-slate-900'),
            headerLeft: () => <ModalCloseIcon size={18} onPress={handleNavigationBack} />,
        });
    }, []);

    const handleNavigationBack = () => {
        navigation.goBack();
    };


    return (
        <View style={tailwind('h-full flex-1 bg-white')}>
            <WebView
                style={tailwind('flex-1')}
                source={{ uri: route.params?.meta?.authorization_url ?? 'https://trynanaapp.com' }}
            />
        </View>
    );
};
