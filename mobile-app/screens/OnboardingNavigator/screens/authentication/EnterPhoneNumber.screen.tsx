import {View, Text, Image} from "react-native";
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
import {SafeAreaView} from "react-native-safe-area-context";
import FastImage from "react-native-fast-image";
import AppLogo from '@assets/app/nana-logo.png'
import {useLoading} from "@contexts/loading.provider";
type EnterPhoneNumberScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.ENTER_MOBILE_PHONE>
export function EnterPhoneNumberScreen ({navigation}: EnterPhoneNumberScreenProps): JSX.Element {
    const [phoneNumber, setPhoneNumber] = useState<string>('')
    const [loading, setLoading] = useState<boolean>(false)
    const analytics = useAnalytics()
    const {setLoadingState} = useLoading()
    useEffect(() => {
       void analytics.screen(OnboardingScreenName.ENTER_MOBILE_PHONE)
    }, [])
    async function onContinue(): Promise<void> {
        setLoading(true)
       try {
           setLoadingState(true)
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
            console.log(error)
          ShowToast('error', error.message)
       } finally {
            setLoadingState(false)
           setLoading(false)
       }
    }
    return (
        <SafeAreaView
            testID="OnboardingScreen.EnterPhoneNumberScreen"
            style={tailwind('bg-white p-5 flex-1 overflow-hidden')}
        >
            <View style={tailwind('flex h-full w-full flex-col items-between justify-between')}>
                <View>
                    <GenericButtonLink
                        disabled={true}
                        style={tailwind('')}
                        labelColor={tailwind('text-gray-300 text-right text-sm mb-2')}
                        onPress={() => navigation.navigate<any>('ONBOARDING_GUEST')}
                        label="Continue as guest"
                    />
                    <View style={tailwind('flex flex-row items-center justify-center w-full')}>
                        <FastImage source={AppLogo} style={{width: 100, height: 65}} />
                    </View>
                    <View style={tailwind('flex flex-col w-full mt-10')}>
                        <Text style={[tailwind('w-4/5 font-bold text-left text-3xl text-slate-900'), {lineHeight: 30}]}>Groceries, Food and Parcel delivery at your fingerprint</Text>
                        <Text style={tailwind('font-normal text-sm mt-3')}>We deliver food, groceries, and packages from top restaurants and stores right to your doorstep</Text>
                    </View>
                </View>

                <View style={tailwind('')}>
                    <TextInputWithLabel
                        label="Enter your phone number to get started"
                        containerStyle={tailwind('mt-2.5 mb-6 overflow-hidden')}
                        textAlign='left'
                        keyboardType='phone-pad'
                        testID="EnterPhoneNumberScreen.TextInput"
                        onChangeText={setPhoneNumber}
                        placeholder=""
                        placeHolderStyle="#717171"
                    />

                </View>
                <View>
                    <TermsConditionRow testID="EnterPhoneNumberScreen.Terms" />
                    <GenericButton
                        loading={loading}
                        onPress={onContinue}
                        labelColor={tailwind('text-white')}
                        label='Continue'
                        backgroundColor={tailwind('bg-primary-100')}
                        testId="OnboardingScreen.EnterPhoneNumberScreen.ContinueButton"
                        disabled={phoneNumber === "" || phoneNumber.length < 11}
                    />
                </View>
            </View>
        </SafeAreaView>
    )
}
