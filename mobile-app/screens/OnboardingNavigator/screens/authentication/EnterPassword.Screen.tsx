import {useEffect, useState} from "react";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";
import {Text, View} from "react-native";
import { tailwind} from "@tailwind";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {BackButton} from "@screens/OnboardingNavigator/screens/components/BackButton";
import {StackScreenProps} from "@react-navigation/stack";
import {OnboardingParamsList} from "@screens/OnboardingNavigator/OnboardingNav";
import {_api} from "@api/_request";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {showTost} from "@components/commons/Toast";
import {useToast} from "react-native-toast-notifications";
import {useAnalytics} from "@segment/analytics-react-native";
import * as Device from "expo-device";
import {cookieParser} from "../../../../../utils/cookieParser";
import {SafeAreaView} from "react-native-safe-area-context";
import {useLoading} from "@contexts/loading.provider";

type EnterPasswordScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.ENTER_PASSWORD>

export function EnterPasswordScreen ({navigation, route}: EnterPasswordScreenProps): JSX.Element {
    const {setToken} = useAuthPersistence()

    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [firstName, setFirstName] = useState<string>('')
    const [lastName, setLastName] = useState<string>('')
    const {setLoadingState} = useLoading()
    const [loading, _setIsLoading] = useState<boolean>(false)
    const toast = useToast()
    const analytics = useAnalytics()


    useEffect(() => {
        void analytics.identify(undefined,{
            phone:route.params.phoneNumber,
            firstName: route.params?.firstName,
            device: {
                version: Device.osVersion,
                name: Device.osName,
                brand: Device.brand
            }
        })
        void analytics.screen(OnboardingScreenName.ENTER_MOBILE_PHONE)

        navigation.setOptions({
            headerLeft: () => <BackButton onPress={() => navigation.goBack()} testID="" />,
            headerTitle: '',
        })
    }, [route.params.phoneNumber])

    async function onContinue(): Promise<void> {
        _setIsLoading(true)
        try {
            setLoadingState(true)
            if (route.params.hasAccount) {
                const { cookies} = await _api.requestData({
                    method: 'POST',
                    url: 'auth/login',
                    data: {
                        phone: route.params.phoneNumber,
                        password,
                    }
                })

                await  setToken(cookieParser(cookies))

                showTost(toast, 'Login successfully', 'success')
                void analytics.track('LOGIN', {
                    phone: route.params.phoneNumber
                })
            } else  {
                 const {data} = await _api.requestData<any, {pinId: string, phone: string}>({
                    method: 'POST',
                    url: 'user/register',
                    data: {
                        phone: route.params.phoneNumber,
                        password,
                        email: email.toLowerCase(),
                        firstName: firstName.toLowerCase(),
                        lastName: lastName.toLowerCase()
                    }
                })
                console.log({data})
                showTost(toast, 'Account created', 'success')
                navigation.navigate(OnboardingScreenName.VERIFY_PHONE_NUMBER as any, {
                    pinId: data.pinId
                } as any)
                void analytics.track('REGISTER', {
                    phone: route.params.phoneNumber
                })
            }
        } catch (error: any) {
            console.log({error})
            if (error?.message.toLowerCase().includes("verify")) {
                navigation.navigate(OnboardingScreenName.VERIFY_PHONE_NUMBER as any, {
                    pinId: error?.message?.split('Verify phone number-')[1]
                } as any)
            } else {
                showTost(toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error')
            }
        } finally {
            setLoadingState(false)
            _setIsLoading(false)
        }

    }

    const HeaderTextExistingAccount = `Welcome back, ${route?.params?.firstName  ?? 'User'}`

    return (
        <SafeAreaView
            testID="OnboardingScreen.EnterPasswordScreen"
            style={[tailwind('flex-1 bg-white')]}
        >

            <View style={tailwind('px-5 flex-grow')}>
                   <Text
                       testID='OnboardingScreen.EnterPasswordScreen.EnterPasswordText'
                       style={tailwind('font-bold text-xl mb-5 text-brand-black-500')}
                   >
                       {route.params.hasAccount ? HeaderTextExistingAccount : 'Sign up for a new account'}
                   </Text>
                <View style={tailwind('flex flex-col')}>
                    {!route.params.hasAccount && (
                        <>
                            <TextInputWithLabel placeholder="" label="Email" containerStyle={tailwind('my-3')} labelTestId="EnterPasswordScreen.TextInput.Label" onChangeText={setEmail} value={email} />
                            <View style={tailwind('my-3')}>
                                <Text
                                    style={tailwind('font-normal text-xs text-brand-gray-700')}>
                                    How will our delivery partners call you?
                                </Text>
                                <View style={tailwind('flex flex-row items-center w-full')}>
                                    <TextInputWithLabel placeholder="" label="First Name" containerStyle={tailwind(' w-1/2 pr-2')} labelTestId="EnterPasswordScreen.TextInput.Label" onChangeText={setFirstName} value={firstName} />
                                    <TextInputWithLabel placeholder="" label="Last Name" containerStyle={tailwind('w-1/2 pl-2')} labelTestId="EnterPasswordScreen.TextInput.Label" onChangeText={setLastName} value={lastName} />
                                </View>
                            </View>
                        </>
                    )}
                    <TextInputWithLabel secureTextEntry containerStyle={tailwind('my-3 mb-10')}  label="Password" placeholder="" moreInfo={route.params.hasAccount ? undefined : "Password should be at least 8 characters"} labelTestId="EnterPasswordScreen.TextInput.Label" onChangeText={setPassword} value={password} />
                </View>
                <GenericButton
                    loading={loading}
                    onPress={onContinue}
                    labelColor={tailwind('text-white')}
                    label='Continue'
                    backgroundColor={tailwind('bg-primary-100')}
                    testId="OnboardingScreen.EnterPasswordScreen.ContinueButton"
                    disabled={password === "" || password.length <= 7 || loading}
                />
            </View>
        </SafeAreaView>
    )
}
