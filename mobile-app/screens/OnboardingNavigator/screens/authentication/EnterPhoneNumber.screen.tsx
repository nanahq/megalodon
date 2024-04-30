import {View, Text} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {useEffect, useState} from 'react'

import {tailwind} from "@tailwind";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {GenericButton, GenericButtonLink} from "@components/commons/buttons/GenericButton";

import {TermsConditionRow} from "@screens/OnboardingNavigator/screens/components/TermsConditionSection";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {internationalisePhoneNumber} from '@nanahq/sticky'
import {_api} from "@api/_request";
import {ShowToast} from "@components/commons/Toast";
import {useAnalytics} from "@segment/analytics-react-native";

type EnterPhoneNumberScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.ENTER_MOBILE_PHONE>
export function EnterPhoneNumberScreen ({navigation}: EnterPhoneNumberScreenProps): JSX.Element {
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const analytics = useAnalytics()

    useEffect(() => {
       void analytics.screen(OnboardingScreenName.ENTER_MOBILE_PHONE)
    }, [])
    async function onContinue(): Promise<void> {
        setLoading(true)
       try {
           const {data} = await _api.requestData({
               method: 'GET',
               url: `user/validate/${internationalisePhoneNumber(phoneNumber)}`,
           }) as {data: {hasAccount: boolean, firstName?: string}}

           navigation.navigate({
               name: OnboardingScreenName.ENTER_PASSWORD,
               params: {
                   phoneNumber: internationalisePhoneNumber(phoneNumber),
                   ...data
               },
               merge: true,
           });
       } catch (error: any) {
          ShowToast('error', error.message)
       } finally {
           setLoading(false)
       }
    }
    return (
        <View
            testID="OnboardingScreen.EnterPhoneNumberScreen"
            style={tailwind('pt-12 bg-white flex-1 overflow-hidden')}
        >
        <View style={tailwind('pt-10 px-5 bg-white')}>
            <GenericButtonLink
                style={tailwind('')}
                labelColor={tailwind('text-gray-700 text-right text-sm mb-2')}
                onPress={() => navigation.navigate<any>('ONBOARDING_GUEST')}
                label="Continue as guest"
            />
            <Text
                testID='OnboardingScreen.EnterPhoneNumberScreen.EnterPhoneText'
                style={tailwind('font-bold text-2xl mb-5 text-black')}
            >
                Enter your mobile number
            </Text>
            <TextInputWithLabel
                label=""
                containerStyle={tailwind('mt-2.5 mb-10 mb-6 overflow-hidden')}
                textAlign='left'
                keyboardType='phone-pad'
                testID="EnterPhoneNumberScreen.TextInput"
                onChangeText={setPhoneNumber}
                placeholder="091 740 48621"
                placeHolderStyle="#717171"
            />
            <GenericButton
                loading={loading}
                onPress={onContinue}
                labelColor={tailwind('text-white')}
                label='Continue'
                backgroundColor={tailwind('bg-primary-500')}
                testId="OnboardingScreen.EnterPhoneNumberScreen.ContinueButton"
                disabled={phoneNumber === "" || phoneNumber.length < 11}
            />
        </View>
             <View style={tailwind('mt-14 pt-3.5 px-5')}>
               <TermsConditionRow testID="EnterPhoneNumberScreen.Terms" />
            </View>
        </View>
    )
}
