import {useState} from "react";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {Text, View} from "react-native";
import { tailwind} from "@tailwind";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {BackButton} from "@screens/OnboardingNavigator/screens/components/BackButton";
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {VerificationCodeInput} from "@components/commons/inputs/VerificationCodeInput";
import {_api} from "@api/_request";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {ShowToast} from "@components/commons/Toast";
import {cookieParser} from "../../../../../utils/cookieParser";

type VerifyPhoneNumberScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.VERIFY_PHONE_NUMBER>


export function VerifyPhoneNumberScreen ({navigation, route}:VerifyPhoneNumberScreenProps): JSX.Element {
    const {setToken} = useAuthPersistence()
    const [code, setCode] = useState<string>('')
    const [loading , _setIsLoading] = useState<boolean>(false)
    async function onContinue(): Promise<void> {
        try {
            _setIsLoading(true)
            _setIsLoading(true)
            const {data, cookies} = await _api.requestData({
                method: 'POST',
                url: 'users/verify',
                data: {
                    phoneNumber: route.params.phoneNumber,
                    code
                }
            })

            if (data.status === 1) {
                await setToken(cookieParser(cookies[0]))
            }
        } catch (error: any) {
            ShowToast('error', error.message)
        } finally {
            _setIsLoading(false)
        }


    }
    return (
        <View
            testID="OnboardingScreen.VerifyPhoneNumberScreen"
            style={[tailwind('pt-12 flex-1'), {overflow: 'hidden'}]}
        >

            <View style={tailwind('pt-5 px-5')}>
               <View>
                   <Text
                       testID='OnboardingScreen.VerifyPhoneNumberScreen.EnterCodeText'
                       style={tailwind('font-bold text-2xl mb-5 text-black')}
                   >
                       Enter Verification Code
                   </Text>
                   <Text
                       testID='OnboardingScreen.VerifyPhoneNumberScreen.EnterCodeText.SubText'
                       style={tailwind('text-sm text-brand-gray-700')}
                   >
                      A 6-digit code has been sent to your phone via SMS
                   </Text>
               </View>
                <View style={tailwind('mt-6')}>
                    <VerificationCodeInput
                        testID="OnboardingScreen.VerifyPhoneNumberScreen.VerificationCodeInput"
                        onChange={setCode}
                        value={code}
                        cellCount={6}
                        autofocus
                    />
                </View>
                <GenericButton
                    style={tailwind('mt-10')}
                    loading={loading}
                    onPress={onContinue}
                    labelColor={tailwind('text-white')}
                    label='Verify'
                    backgroundColor={tailwind('bg-brand-black-500')}
                    testId="OnboardingScreen.VerifyPhoneNumberScreen.VerifyButton"
                    disabled={code === "" || code.length <= 3}
                />

            </View>
            <View style={tailwind('mt-14 pt-3.5 px-5')}>
                <BackButton onPress={() => navigation.goBack()} testID="VerifyPhoneNumberScreen.BackButton"/>
            </View>
        </View>
    )
}
