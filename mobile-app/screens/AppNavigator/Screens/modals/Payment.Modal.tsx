import React, { useEffect, useState } from 'react';
import {CardStyleInterpolators, StackScreenProps} from '@react-navigation/stack';
import { AppParamList } from '@screens/AppNavigator/AppNav';
import { ModalScreenName} from '@screens/AppNavigator/ScreenName.enum';
import { tailwind } from '@tailwind';
import { showTost } from '@components/commons/Toast';
import { useToast } from 'react-native-toast-notifications';
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import { WebView } from 'react-native-webview';
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {_api} from "@api/_request";

type PaymentModalProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_PAYMENT_SCREEN>;

export const PaymentModal: React.FC<PaymentModalProps> = ({ navigation, route }) => {
    const [paymentUrl, setPaymentUrl] = useState<string | undefined>(route.params.meta?.authorization_url)
    // const toast = useToast();

    // const [loading, setLoading] = useState(true)
    // const [charge, setCharge] = useState<{authorization_url: string, access_code: string} | undefined>(undefined)

    // useEffect(() => {
    //    const initiateCharge = async () => {
    //        try {
    //            setLoading(true)
    //
    //            const payload = {
    //                amount: String(route.params.order.totalOrderValue),
    //                email: route.params.order.user.email
    //            }
    //
    //            const {data} = await _api.requestData({
    //                method: 'POST',
    //                url: 'payment/charge/initiate',
    //                data: payload,
    //            })
    //            setCharge(data)
    //        } catch (error) {
    //            showTost(toast, 'Failed to initiate charge', 'error')
    //            console.log(e)
    //        } finally {
    //            setLoading(false)
    //        }
    //    }
    //    void initiateCharge()
    // }, [])

    useEffect(() => {
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
