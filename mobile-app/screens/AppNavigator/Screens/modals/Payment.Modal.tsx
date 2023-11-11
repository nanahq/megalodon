import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { StackScreenProps } from '@react-navigation/stack';
import { AppParamList } from '@screens/AppNavigator/AppNav';
import { ModalScreenName } from '@screens/AppNavigator/ScreenName.enum';
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
import moment from "moment";

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
                    navigation.navigate(OrderScreenName.ORDERS)
                }, 2000)
            }
        } catch (error) {
            showTost(toast, 'Failed to fetch payments', 'error');
        }
    };

    const onPaymentTypeSelect = (type: 'BANK_TRANSFER' | 'USSD' | string) => {
        setPaymentType(() => type);
    };

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
                        <View style={tailwind('border-0.5 flex flex-col w-full border-brand-ash p-3')}>
                            <View style={tailwind('flex  my-2 flex-row items-center w-full justify-between')}>
                                <Text style={tailwind('text-lg')}>Bank name</Text>
                                <Text style={tailwind('text-lg font-bold')}>{paymentInfo.transfer_bank}</Text>
                            </View>
                            <View style={tailwind('flex  my-2 flex-row items-center w-full justify-between')}>
                                <Text style={tailwind('text-lg')}>Bank account number</Text>
                                <Text style={tailwind('text-lg font-bold')}>{paymentInfo.transfer_account}</Text>
                            </View>
                            <View style={tailwind('flex  my-2 flex-row items-center w-full justify-between')}>
                                <Text style={tailwind('text-lg')}>Amount to transfer</Text>
                                <Text style={tailwind('text-lg font-bold')}>{paymentInfo.transfer_amount}</Text>
                            </View>
                            <View>
                                <Text style={tailwind('text-brand-gray-700 font-bold mt-2')}>Payment should be made before {moment(paymentInfo.account_expiration).format('HH:mm')}</Text>
                            </View>
                        </View>
                        <GenericButton
                            loading={verify}
                            label="Verifying Payment"
                            onPress={() => setVerify(true)}
                            labelColor={tailwind('text-white')}
                            backgroundColor={tailwind('bg-primary-500')}
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
