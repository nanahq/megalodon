import {useState} from "react";
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
import {cookieParser} from "../../../../../utils/cookieParser";


type EnterPasswordScreenProps = StackScreenProps<OnboardingParamsList, OnboardingScreenName.ENTER_PASSWORD>

export function EnterPasswordScreen ({navigation, route}: EnterPasswordScreenProps): JSX.Element {
    const {setToken} = useAuthPersistence()

    const [password, setPassword] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [loading, _setIsLoading] = useState<boolean>(false)
    const toast = useToast()

    async function onContinue(): Promise<void> {
        _setIsLoading(true)
        try {
            if (route.params.hasAccount) {
                const { cookies} = await _api.requestData({
                    method: 'POST',
                    url: 'auth/login',
                    data: {
                        phone: route.params.phoneNumber,
                        password,
                    }
                })
                await  setToken(cookieParser(cookies[0]))
                showTost(toast, 'Login successfully', 'success')
            } else  {
                const { cookies} = await _api.requestData({
                    method: 'POST',
                    url: 'user/register',
                    data: {
                        phone: route.params.phoneNumber,
                        password,
                        email: email.toLowerCase()
                    }
                })


                showTost(toast, 'Account created', 'success')

                setTimeout( async () => {
                    await  setToken(cookieParser(cookies[0]))
                }, 5000)

            }

        } catch (error: any) {
            showTost(toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error')
        } finally {
            _setIsLoading(false)
        }

    }

    const HeaderTextExistingAccount = `Welcome back, ${route?.params?.firstName  ?? 'User'}`

    return (
        <View
            testID="OnboardingScreen.EnterPasswordScreen"
            style={[tailwind('pt-12 flex-1'), {overflow: 'hidden'}]}
        >

            <View style={tailwind('pt-5 px-5')}>
                   <Text
                       testID='OnboardingScreen.EnterPasswordScreen.EnterPasswordText'
                       style={tailwind('font-bold text-2xl mb-5 text-brand-black-500')}
                   >
                       {route.params.hasAccount ? HeaderTextExistingAccount : 'Sign up for a new account'}
                   </Text>
                <View style={tailwind('flex flex-col')}>
                    {route.params.hasAccount === false && (
                        <TextInputWithLabel placeholder="musa@example.com" label="Email" containerStyle={tailwind('my-3')} labelTestId="EnterPasswordScreen.TextInput.Label" onChangeText={setEmail} value={email} />
                    )}
                    <TextInputWithLabel secureTextEntry containerStyle={tailwind('my-3 mb-10')}  label="Password" moreInfo="Password should be at least 8 characters" labelTestId="EnterPasswordScreen.TextInput.Label" onChangeText={setPassword} value={password} />
                </View>
                <GenericButton
                    loading={loading}
                    onPress={onContinue}
                    labelColor={tailwind('text-white')}
                    label='Continue'
                    backgroundColor={tailwind('bg-primary-500')}
                    testId="OnboardingScreen.EnterPasswordScreen.ContinueButton"
                    disabled={password === "" || password.length <= 7 || loading}
                />
            </View>
            <View style={tailwind('mt-14 pt-3.5 px-5')}>
                <BackButton onPress={() => navigation.goBack()}   testID="EnterPasswordScreen.BackButton" />
            </View>
        </View>
    )
}
