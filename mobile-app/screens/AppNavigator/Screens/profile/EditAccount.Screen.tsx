import {StackScreenProps} from "@react-navigation/stack";
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import {SafeAreaView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";
import React, {useEffect, useState} from "react";
import {GenericTextInputV2} from "@components/commons/inputs/TextInput";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {useAppDispatch} from "@store/index";
import {fetchProfile} from "@store/profile.reducer";
import {UpdateUserDto, UserI} from "@nanahq/sticky";
import {_api} from "@api/_request";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import * as Device from "expo-device";
import {useSafeAreaInsets} from "react-native-safe-area-context";

type AccountScreenNavigationProps = StackScreenProps<ProfileParamsList, ProfileScreenName.EDIT_ACCOUNT>

export const EditAccountScreen: React.FC<AccountScreenNavigationProps> = ({navigation, route}) => {
    const [value, setValue] = useState(route.params.value)
    const [firstName, setFirstName] = useState(route.params.type === 'Name' ?route.params.value?.split(' ')[0]: '')
    const [lastName, setLastName] = useState(route.params.type === 'Name' ?route.params.value?.split(' ')[1] : '')
    const [loading, setLoading] = useState(false)

    const isAndroid = Device.osName === 'Android'
    const {top} = useSafeAreaInsets()

    const dispatch =useAppDispatch()
    const toast = useToast()
    useEffect(() => {
        setValue(route.params.value);
        setFirstName(route.params.type === 'Name' ? route.params.value.split(' ')[0] : '');
        setLastName(route.params.type === 'Name' ? route.params.value.split(' ')[1] : '');
    }, []);

    const handleSubmit = async () => {
        let payload: Partial<UserI> = {}
        const type = route.params.type.toLowerCase()
        if (type === 'email') {
            payload = {
                email: value.toLowerCase()
            }
        } else if (type === 'name') {
            payload = {
                firstName,
                lastName
            }
        }

        try {
            setLoading(true)
             await _api.requestData<Partial<UpdateUserDto>, undefined>({
                method: 'PUT',
                url: 'user/update',
                data: payload
            })
            dispatch(fetchProfile())
            showTost(toast, `${route.params.type} has been updated!`, 'success')
        } catch (error) {
            showTost(toast, `Failed to update${route.params.type}`, 'error')
        } finally {
            setLoading(false)
        }
    }
    return (
        <View style={tailwind('flex-1 bg-white px-4')}>
            <SafeAreaView style={[tailwind('flex-grow'),{paddingTop: isAndroid ? top + 10 : 0 }]} >
            <View>
                    <IconButton
                        onPress={() => navigation.goBack()}
                        iconName='arrow-left'
                        iconType='Feather'
                        iconSize={32}
                        style={tailwind('bg-brand-ash rounded-full p-3 w-14 h-14')}
                    />
                    <View style={tailwind('w-full mt-3 flex flex-row items-center justify-between')}>
                        <Text style={tailwind('font-bold text-3xl')}>{route.params.type}</Text>
                    </View>
                    {(() => {
                        switch (route.params.type) {
                            case "Email":
                                return (
                                    <GenericTextInputV2
                                        style={tailwind('text-lg')}
                                        label="Email"
                                        containerStyle={tailwind('mt-2.5 mb-10 mb-6 overflow-hidden')}
                                        textAlign='left'
                                        keyboardPad='email-address'
                                        testID="EnterPhoneNumberScreen.TextInput"
                                        onChangeText={setValue}
                                        initialText={value}
                                    />
                                );

                            case "Phone":
                                return (
                                    <GenericTextInputV2
                                        style={tailwind('text-lg')}
                                        label="Phone number"
                                        moreInfo="Contact support to change phone number"
                                        containerStyle={tailwind('mt-2.5 mb-10 mb-6 overflow-hidden')}
                                        textAlign='left'
                                        editable={false}
                                        keyboardPad='phone-pad'
                                        testID="EnterPhoneNumberScreen.TextInput"
                                        onChangeText={setValue}
                                        initialText={value}
                                    />
                                );

                            case "Name":
                                return (
                                    <>
                                        <GenericTextInputV2
                                            style={tailwind('text-lg')}
                                            label="First Name"
                                            containerStyle={tailwind('mt-2.5 mb-10 mb-6 overflow-hidden')}
                                            textAlign='left'
                                            keyboardPad='default'
                                            testID="EnterPhoneNumberScreen.TextInput"
                                            onChangeText={setFirstName}
                                            initialText={firstName}
                                        />
                                        <GenericTextInputV2
                                            style={tailwind('text-lg')}
                                            label="Last Name"
                                            containerStyle={tailwind('mt-2.5 mb-10 mb-6 overflow-hidden')}
                                            textAlign='left'
                                            keyboardPad='default'
                                            testID="EnterPhoneNumberScreen.TextInput"
                                            onChangeText={setLastName}
                                            initialText={lastName}
                                        />
                                    </>
                                );
                        }

                    })()}
                </View>
            </SafeAreaView>
            <GenericButton
                style={tailwind('mb-5')}
                disabled={route.params.type === 'Phone'}
                loading={loading}
                onPress={handleSubmit}
                label={`Save ${route.params.type}`}
                backgroundColor={tailwind('bg-primary-500')}
                labelColor={tailwind('text-white')}
            />
        </View>
    )
}
