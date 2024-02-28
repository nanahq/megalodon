import * as Device from 'expo-device'
import * as Notifications from "expo-notifications";
import Constants from "expo-constants";
import Intercom from "@intercom/intercom-react-native";

export async function registerForPushNotificationsAsync(callback?: () => void) {
    let token;
    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            if (callback){
                void callback()
            }
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants?.expoConfig?.extra?.eas?.projectId})).data;

        if (existingStatus !== 'granted') {
            await Intercom.sendTokenToIntercom(token)
        }
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
