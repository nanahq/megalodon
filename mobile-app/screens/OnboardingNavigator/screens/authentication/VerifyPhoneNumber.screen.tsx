import React, { useState, useEffect } from "react";
import { Pressable, Text, View } from "react-native";
import { tailwind } from "@tailwind";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import { BackButton } from "@screens/OnboardingNavigator/screens/components/BackButton";
import { StackScreenProps } from "@react-navigation/stack";
import { OnboardingParamsList } from "@screens/OnboardingNavigator/OnboardingNav";
import { VerificationCodeInput } from "@components/commons/inputs/VerificationCodeInput";
import { _api } from "@api/_request";
import { useAuthPersistence } from "@contexts/AuthPersistenceProvider";
import { showTost} from "@components/commons/Toast";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {useToast} from "react-native-toast-notifications";
import { cookieParser } from "../../../../../utils/cookieParser";

type VerifyPhoneNumberScreenProps = StackScreenProps<
    OnboardingParamsList,
    OnboardingScreenName.VERIFY_PHONE_NUMBER
>;

export function VerifyPhoneNumberScreen({
                                            navigation,
                                            route,
                                        }: VerifyPhoneNumberScreenProps): JSX.Element {
    const { setToken } = useAuthPersistence();
    const [code, setCode] = useState<string>("");
    const [loading, _setIsLoading] = useState<boolean>(false);
    const [resendDisabled] = useState<boolean>(false);
    const [sendingVerification, setSendingVerification] = useState(false)
    const toast = useToast()



    async function onContinue(): Promise<void> {
        try {
            _setIsLoading(true);

            const { cookies } = await _api.requestData({
                method: "POST",
                url: "user/verify",
                data: {
                    phone: route?.params?.phoneNumber,
                    code,
                },
            });
            await setToken(cookieParser(cookies[0]));
        } catch (error: any) {
            showTost(toast,error.message, 'error');
        } finally {
            _setIsLoading(false);
        }
    }

    const resendPhoneNumber = async () => {
        try {
            setSendingVerification(true)
            await _api.requestData({
                method: 'GET',
                url: `user/resend-validation/${route.params.phoneNumber}`
            })

            showTost(toast, 'Verification code sent successfully', 'success')
        } catch (error: any) {
            showTost(toast,typeof error.message !== 'string' ? error.message[0] : error.message, 'error')
        } finally {
            setSendingVerification(false)
        }
    };

    return (
        <View
            testID="OnboardingScreen.VerifyPhoneNumberScreen"
            style={[tailwind("pt-12 flex-1"), { overflow: "hidden" }]}
        >
            <View style={tailwind("pt-5 px-5")}>
                <View>
                    <Text
                        testID="OnboardingScreen.VerifyPhoneNumberScreen.EnterCodeText"
                        style={tailwind("font-bold text-2xl mb-5 text-black")}
                    >
                        Enter Verification Code
                    </Text>
                    <Text
                        testID="OnboardingScreen.VerifyPhoneNumberScreen.EnterCodeText.SubText"
                        style={tailwind("text-sm text-brand-gray-700")}
                    >
                        A 6-digit code has been sent to your phone via SMS
                    </Text>
                </View>
                <View style={tailwind("mt-6")}>
                    <VerificationCodeInput
                        testID="OnboardingScreen.VerifyPhoneNumberScreen.VerificationCodeInput"
                        onChange={setCode}
                        value={code}
                        cellCount={6}
                        autofocus
                    />
                </View>
                <View style={tailwind("flex flex-row justify-center mt-5 items-center")}>
                    <Text style={tailwind("text-sm text-brand-gray-700")}>Didn't get code?</Text>
                    <Pressable disabled={resendDisabled} onPress={resendPhoneNumber}>
                        <Text style={tailwind("text-sm text-brand-gray-700 ml-2 font-bold underline")}>
                            {sendingVerification ? 'resending' : 'Resend'}
                        </Text>
                    </Pressable>
                </View>
                <GenericButton
                    style={tailwind("mt-10")}
                    loading={loading}
                    onPress={onContinue}
                    labelColor={tailwind("text-white")}
                    label="Verify"
                    backgroundColor={tailwind("bg-brand-black-500")}
                    testId="OnboardingScreen.VerifyPhoneNumberScreen.VerifyButton"
                    disabled={code === "" || code.length <= 5}
                />
            </View>
            <View style={tailwind("mt-14 pt-3.5 px-5")}>
                <BackButton onPress={() => navigation.goBack()} testID="VerifyPhoneNumberScreen.BackButton" />
            </View>
        </View>
    );
}
