import {Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {ModalBackIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {tailwind} from "@tailwind";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import {clearOnAuthError} from "@store/common";
import {useProfile} from "@contexts/profile.provider";

export const DeleteAccountScreen = () => {
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const {profile} = useProfile()
    const [loading, setLoading] = useState(false)
    const toast = useToast()
    const [reason, setReason] = useState()
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <ModalBackIcon onPress={() => navigation.goBack()} />,
        })
    }, [])

    const handleDeleteAccount = async () => {
        setLoading(true)
        try {
            await _api.requestData({
                method: 'GET',
                url: `/user/delete-request/${profile.phone}`
            })
            showTost(toast, 'Account deleted successfully', 'warning')

            void clearOnAuthError()
        } catch (error){

        } finally {
            setLoading(false)
        }
    }
    return (
        <KeyboardAwareScrollView style={tailwind('flex flex-1 bg-white')}>
              <View style={tailwind('flex flex-col px-4')}>
                  <View style={tailwind('flex-grow mt-10')}>
                      <View style={tailwind('flex flex-col mb-5 ')}>
                          <Text style={tailwind('text-4xl font-bold mb-5')}>Delete account</Text>
                          <Text style={tailwind('text-gray-400 text-base')}>{profile?.firstName ?? 'User'}, We are sorry really sorry to see you go. Are you sure you want to delete your account? Once you confirm, your data will be gone forever.</Text>
                      </View>
                      <TextInputWithLabel label="Choose a reason" value={reason} onChangeText={(value) => setReason(value)} />
                  </View>
                  <View style={tailwind('flex flex-col mt-20')}>
                      <GenericButton loading={loading} labelColor={tailwind('text-white')} onPress={handleDeleteAccount } label="Delete Account" />
                      <Text style={tailwind('text-xs text-black text-center mt-5')}>Your data will be kept for 30 days before we delete it entirely from your system. Any attempt to login will activate your account.</Text>
                  </View>
              </View>
            </KeyboardAwareScrollView>
    )
}
