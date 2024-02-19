import React, { useEffect, useState } from 'react';
import {CardStyleInterpolators, StackScreenProps} from '@react-navigation/stack';
import { AppParamList } from '@screens/AppNavigator/AppNav';
import { ModalScreenName} from '@screens/AppNavigator/ScreenName.enum';
import { tailwind } from '@tailwind';
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import { WebView } from 'react-native-webview';
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {useAnalytics} from "@segment/analytics-react-native";

type PaymentModalProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_PAYMENT_SCREEN>;

export const PaymentModal: React.FC<PaymentModalProps> = ({ navigation, route }) => {
    const [paymentUrl] = useState<string | undefined>(route.params.meta?.authorization_url)
    const analytics = useAnalytics()
    useEffect(() => {
        void analytics.screen(ModalScreenName.MODAL_PAYMENT_SCREEN)
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Payment for order #${route?.params.order.refId}`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            headerLeft: () => <ModalCloseIcon onPress={handleNavigationBack} />,
        });
    }, []);
    const handleNavigationBack = () => {
        navigation.goBack();
    };

    if ( paymentUrl === undefined) {
        return <LoaderComponentScreen />
    }

    return (
        <WebView style={tailwind('flex-1')}
         source={{ uri: paymentUrl }}
        />
    );
};
