import React, {useEffect, useState} from 'react';
import {CardStyleInterpolators, StackScreenProps} from '@react-navigation/stack';
import { AppParamList } from '@screens/AppNavigator/AppNav';
import { ModalScreenName} from '@screens/AppNavigator/ScreenName.enum';
import { tailwind } from '@tailwind';
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {useAnalytics} from "@segment/analytics-react-native";
import {ScrollView, View, Text} from "react-native";
import {useAppDispatch, useAppSelector} from "@store/index";
import { GenericTextInputV2} from "@components/commons/inputs/TextInput";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {RedeemedCoupon} from "@screens/AppNavigator/Screens/modals/components/RedeemedCoupon";
import {_api} from "@api/_request";
import {CouponRedeemResponse} from "@nanahq/sticky";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {fetchProfile} from "@store/profile.reducer";

type PromotionModalProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_PROMO_SCREEN>;

export const PromotionModal: React.FC<PromotionModalProps> = ({ navigation }) => {
    const [code, setCode] = useState<string>("")
    const [submitting, setSubmitting] = useState<boolean>(false)
    const {profile} = useAppSelector((state) => state.profile)
    const dispatch = useAppDispatch()
    const toast = useToast()
    const analytics = useAnalytics()

    useEffect(() => {
        void analytics.screen(ModalScreenName.MODAL_PROMO_SCREEN)
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Promotion`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitleStyle: tailwind('text-xl'),
            cardStyleInterpolator: CardStyleInterpolators.forModalPresentationIOS,
            headerLeft: () => <ModalCloseIcon onPress={handleNavigationBack} />,
        });
    }, []);

    const handleNavigationBack = () => {
        navigation.goBack();
    };


    const handleSubmitCode = async () => {
        if (code === '') {
            return true
        }

        setSubmitting(true)
        try {
         const {data} = await _api.requestData<{couponCode: string}, CouponRedeemResponse>({
             method: 'POST',
             url: 'coupon/redeem',
             data: {
                 couponCode: code
             }
         })
            if (data.status === 'OK'){
                dispatch(fetchProfile())
                showTost(toast, 'Coupon redeemed!', 'success')
                setCode('')
                void analytics.track('EVENT:REDEEM-COUPON')
            } else {
                showTost(toast, data.message, 'error' )
            }
        } catch (error) {
            console.error(error)
        } finally {
            setSubmitting(false)
        }
    }

    return (
        <ScrollView style={tailwind('flex-1 bg-white px-5 overflow-hidden')}>
            <View style={tailwind('flex flex-col mt-5')}>
                <GenericTextInputV2
                    editable={!submitting}
                    placeholder="Enter Promo Code"
                    onChangeText={(value) => setCode(value)}
                    style={tailwind('text-base')}
                    label="Promo code"
                    containerStyle={tailwind('mb-3 overflow-hidden')}
                    textAlign='left'
                    testID="EnterPhoneNumberScreen.TextInput"
                    initialText={code}
                />
                <GenericButton
                    loading={submitting}
                    disabled={code.length < 3}
                    onPress={() => handleSubmitCode()}
                    label="Redeem code"
                    backgroundColor={tailwind('bg-primary-500')}
                    labelColor={tailwind('text-white')}
                />
            </View>
            <View style={tailwind(' mt-10')}>
              <Text style={tailwind('text-base mb-4')}>Available credits and promos</Text>
                {profile.coupons !== undefined && profile.coupons.length > 0 && (
                    <View style={tailwind('flex flex-col')}>
                        {profile.coupons.map((_coupon) => (
                            <RedeemedCoupon coupon={_coupon} cb={() => navigation.goBack()} />
                        ))}
                    </View>
                )}
            </View>
        </ScrollView>
    );
};
