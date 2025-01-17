import React, {useState} from "react";
import {View} from "react-native";
import {tailwind} from "@tailwind";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {CustomerIO} from "customerio-reactnative";
import {NotificationAnimation} from "@screens/AppNavigator/components/NotificationAnimation";

export function NotificationPermission ({setNotificationPermission}: {setNotificationPermission: any}): React.ReactNode {
    const [loading, setLoading] = useState<boolean>(false)
    const requestPermission = async () => {
        setLoading(true)
        const options = {ios : {sound : true, badge : true}}
        const res = await CustomerIO.pushMessaging.showPromptForPushNotifications(options)
        setNotificationPermission(res)
        setLoading(false)
    }

    return (
        <View style={tailwind('flex-1 bg-white py-12')}>
            <View >
                <NotificationAnimation />
                <View style={tailwind('px-7 mt-10')}>
                    <GenericButton
                        loading={loading}
                        labelColor={tailwind('text-white')}
                        onPress={requestPermission}
                        label='Allow notifications'
                        backgroundColor={tailwind("bg-primary-100")} testId=""
                    />
                </View>
            </View>
        </View>
    )
}
