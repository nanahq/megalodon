import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AppParamList } from '@screens/AppNavigator/AppNav';
import {AppScreenName, ModalScreenName} from '@screens/AppNavigator/ScreenName.enum';
import { tailwind } from '@tailwind';
import { _api } from '@api/_request';
import { BankTransferAccountDetails, PaymentI } from '@nanahq/sticky';
import { PaymentOptionsBox } from '@screens/AppNavigator/Screens/basket/components/payment/PaymentBox';
import { GenericButton } from '@components/commons/buttons/GenericButton';
import { showTost } from '@components/commons/Toast';
import { useToast } from 'react-native-toast-notifications';
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {IconComponent} from "@components/commons/IconComponent";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import * as ClipBoard from 'expo-clipboard'
import moment from "moment";
import {IconButton} from "@components/commons/buttons/IconButton";

type PaymentModalProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_PAYMENT_SCREEN>;

export const PaymentModal: React.FC<PaymentModalProps> = ({ navigation, route }) => {
    const [paymentInfo, setPaymentInfo] = useState<BankTransferAccountDetails | undefined>(undefined);
    const [paymentType, setPaymentType] = useState<any | undefined>(route.params.paymentType);
    const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);
    const [verify, setVerify] = useState<boolean>(false);
    const [verified, setVerified] = useState<boolean>(false);
    const [loading, setLoading] = useState(false)
    const toast = useToast();

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Payment for order #${route?.params.order.refId}`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            headerLeft: () => <ModalCloseIcon onPress={handleNavigationBack} />,
        });
    }, []);

    useEffect(() => {
        if (route.params.paymentType === undefined) {
            void fetchPayment();
        }
    }, [route.params.paymentType, route.params.order._id, route.params.order.refId]);

    const handleNavigationBack = () => {
        clearInterval(pollingInterval as any);
        navigation.goBack();
    };

    useEffect(() => {
        if (paymentInfo && verify) {
            const interval = setInterval(() => {
                void checkPaymentStatus();
            }, 5000);

            setPollingInterval(() => interval);
            return () => clearInterval(interval);
        }
    }, [paymentInfo, verify]);

    const fetchPayment = async () => {
        try {
            const pInfo = (await _api.requestData({
                url: `payment/payment/${route.params.order._id}`,
                method: 'GET',
            })).data as PaymentI | any;

            const bankDetails = pInfo === '' ? undefined : JSON.parse(pInfo?.paymentMeta) as BankTransferAccountDetails;

            setPaymentInfo(() => bankDetails);
        } catch (error) {
            showTost(toast, 'Failed to fetch payment Try again', 'error')
        }
    };

    const charge = async () => {
        if (paymentType === 'BANK_TRANSFER') {
            try {
                setLoading(true)
                const { data } = await _api.requestData({
                    url: 'payment/charge/bank-transfer',
                    method: 'POST',
                    data: {
                        orderId: route.params.order._id,
                    },
                });
                setPaymentInfo(data);
                setVerify(true); // Start polling when payment is charged
            } catch (error) {
               showTost(toast, 'Failed to place charge. Try again', 'error')
            } finally {
                setLoading(false)
            }
        }
    };

    const checkPaymentStatus = async () => {
        try {
            const response = (await _api.requestData({
                url: `payment/payment/${route.params.order._id}`,
                method: 'GET',
            })).data as PaymentI;

            const updatedPaymentInfo = response.paymentMeta as unknown as BankTransferAccountDetails;

            if (response.status === 'SUCCESS') {
                clearInterval(pollingInterval as any);
                setPaymentInfo(() => updatedPaymentInfo);
                setVerify(() => false);
                setVerified(() => true)

                setTimeout(() => {
                    navigation.navigate(AppScreenName.ORDERS, {
                        screen: OrderScreenName.ORDERS
                    })
                }, 2000)
            }
        } catch (error) {
            showTost(toast, 'Failed to fetch payments', 'error');
        }
    };

    const onPaymentTypeSelect = (type: 'BANK_TRANSFER' | 'USSD' | string) => {
        setPaymentType(() => type);
    };

    const copy = (text: number): void => {
        ClipBoard.setStringAsync(String(text))
        showTost(toast, 'copied to clipboard', 'success')
    }

    return (
        <View style={tailwind('flex-1 bg-white px-4 pt-1')}>
            <View>
                {paymentInfo === undefined && (
                    <View>
                        <View style={tailwind('mb-5')}>
                            <PaymentOptionsBox onPress={onPaymentTypeSelect} selectedPaymentMethod={paymentType} />
                        </View>
                        <GenericButton
                            loading={loading}
                            disabled={paymentType === undefined}
                            label="Pay now"
                            onPress={() => charge()}
                            labelColor={tailwind('text-white')}
                            backgroundColor={tailwind('bg-primary-500')}
                        />
                    </View>
                )}

                {paymentInfo !== undefined && !verified && (
                    <View style={tailwind('mt-16 flex flex-col w-full')}>
                        <Text style={tailwind('text-center text-lg')}>Transfer NGN {paymentInfo.transfer_amount?.toLocaleString()} to Flutterwave </Text>
                        <View style={tailwind('border-0.5 flex flex-col mt-3 bg-gray-100 rounded w-full border-brand-ash p-3')}>
                            <View style={tailwind('flex  my-2 flex-col')}>
                                <Text style={tailwind('text-sm uppercase')}>Bank name</Text>
                                <Text style={tailwind('text-lg')}>{paymentInfo.transfer_bank}</Text>
                            </View>
                            <View style={tailwind('flex my-2 flex-col')}>
                                <Text style={tailwind('text-sm uppercase ')}>Bank account number</Text>
                                <View style={tailwind('flex flex-row items-center justify-between')}>
                                    <Text style={tailwind('text-lg')}>{paymentInfo.transfer_account}</Text>
                                    <IconButton
                                        iconName='copy'
                                        iconSize={16}
                                        iconType='Feather'
                                        onPress={() => copy(+paymentInfo?.transfer_account)}
                                        style={tailwind('bg-brand-gray-500 p-1 rounded mr-3')}
                                    />
                                </View>
                            </View>
                            <View style={tailwind('flex  my-2 flex-col')}>
                                <Text style={tailwind('text-sm uppercase')}>Amount to transfer</Text>
                                <View style={tailwind('flex flex-row items-center justify-between')}>
                                    <Text style={tailwind('text-lg ')}>NGN {paymentInfo.transfer_amount}</Text>
                                    <IconButton
                                        iconName='copy'
                                        iconSize={16}
                                        iconType='Feather'
                                        onPress={() => copy(paymentInfo.transfer_amount)}
                                        style={tailwind('bg-brand-gray-500 p-1 rounded mr-3')}
                                    />
                                </View>
                            </View>
                        </View>
                        <View style={tailwind('bg-gray-100 p-2 my-5')}>
                            <Text style={tailwind('text-center font-bold mt-2')}>Expires by {moment(paymentInfo.account_expiration).format('HH:mm')}</Text>
                            <Text style={tailwind('text-center text-warning-600 text-sm mt-2')}>Use this account only for this transaction!</Text>
                        </View>
                        <GenericButton
                            loading={verify}
                            label="Verifying Payment"
                            onPress={() => setVerify(true)}
                            labelColor={tailwind('text-white font-medium')}
                            backgroundColor={tailwind('bg-transparent')}
                            style={tailwind('border-0.5 border-black')}
                        />
                    </View>
                )}
                {verified && (
                    <View style={tailwind('flex flex-col items-center justify-center mt-20 w-full')}>
                        <IconComponent iconType="Feather" style={tailwind('font-bold text-success-500 text-3xl')} name="check" size={200} />
                        <Text style={tailwind('font-bold text-success-500 text-3xl')}>Payment Verified!!</Text>
                    </View>
                )}
            </View>
        </View>
    );
};
