import React, {useState} from "react";
import {View} from "react-native";
import {tailwind} from "@tailwind";
import { useAppDispatch} from "@store/index";
import {fetchProfile} from "@store/profile.reducer";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NotificationAnimation} from "@screens/AppNavigator/components/NotificationAnimation";
import * as Device from 'expo-device'
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import {_api} from "@api/_request";
import {UpdateUserDto} from "@nanahq/sticky";
import {showTost} from "@components/commons/Toast";
import {useToast} from "react-native-toast-notifications";

export function NotificationPermission (): JSX.Element {
    const [loading, setLoading] = useState<boolean>(false)
    const dispatch = useAppDispatch()
    const toast = useToast()
    const requestPermission = async () => {
        setLoading(true)
        const token = await registerForPushNotificationsAsync()
        const payload = {expoNotificationToken: token} as any
        try {

            await _api.requestData<Partial<UpdateUserDto>>({
                method: 'PUT',
                url: 'user/update',
                data: payload
            })
            showTost(toast, 'Success!', 'success')
            dispatch(fetchProfile())
        } catch (error: any) {
            showTost(toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error')

        } finally {
            setLoading(false)
        }
    }
    return (
        <View style={tailwind('flex-1 bg-white py-12')}>
               <View>
                   <NotificationAnimation />
                   <View style={tailwind('px-7 mt-10')}>
                       <GenericButton
                           loading={loading}
                           labelColor={tailwind('text-white')}
                           onPress={requestPermission}
                           label='Enable Notifications'
                           backgroundColor={tailwind("bg-primary-500")} testId=""
                       />
                   </View>
               </View>
        </View>
    )
}

async function registerForPushNotificationsAsync() {
    let token;
    Notifications.setNotificationHandler({
        handleNotification: async () => ({
            shouldShowAlert: true,
            shouldPlaySound: false,
            shouldSetBadge: false,
        }),
    });

    if (Device.osName === 'Android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('Failed to get push token for push notification!');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants?.expoConfig?.extra?.eas?.projectId})).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
