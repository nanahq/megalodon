import {  useEffect } from 'react';
import * as Notifications from 'expo-notifications';
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderI, OrderStatus} from "@nanahq/sticky";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";



interface SendPushNotification {
    schedulePushNotification: (payload: Notifications.NotificationRequestInput) => Promise<any>
}


export const useExpoPushNotification = (): SendPushNotification => {

    const navigation = useNavigation<NavigationProp<OrderParamsList>>()

    useEffect(() => {
        Notifications.addNotificationReceivedListener(handleNotification);
       const subscription = Notifications.addNotificationResponseReceivedListener(handleNotificationResponse);

        return () => {
            // Clean up notification listeners when the component unmounts
            Notifications.removeNotificationSubscription(subscription);
        };
    }, []);



    const handleNotification = () => {
        // console.log(' received:', notification);
    };

    const handleNotificationResponse = (response: Notifications.NotificationResponse) => {
        const identifier = response.notification.request.identifier
        let order: OrderI | undefined
        switch (identifier) {
            case OrderStatus.IN_ROUTE:
                order = response.notification.request.content.data?.order as OrderI | undefined
               if (order !== undefined) {
                   navigation.navigate(OrderScreenName.TRACK_ORDER, {
                       order
                   })
               }
            break;
        }

    };

    const schedulePushNotification = async (payload: Notifications.NotificationRequestInput): Promise<void> => {
        await Notifications.scheduleNotificationAsync(payload);
    };


    return {
        schedulePushNotification
    }
}
