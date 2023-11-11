import {
    CardStyleInterpolators,
    createStackNavigator
} from "@react-navigation/stack";
import React from "react";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import {tailwind} from "@tailwind";
import {OrderScreen} from "@screens/AppNavigator/Screens/orders/Orders.Screen";
import * as Device from "expo-device";
import {UndeliveredSingleOrderScreen} from "@screens/AppNavigator/Screens/orders/UndeliveredSingleOrder.Screen";
import {OrderI} from "@nanahq/sticky";
import {SingleOrderScreen} from "@screens/AppNavigator/Screens/orders/SingleOrder.Screen";

export interface OrderParamsList {
    [OrderScreenName.UNDELIVERED_SINGLE_ORDER]: {
        order: OrderI
    },
    [OrderScreenName.DELIVERED_SINGLE_ORDER]: {
        order: OrderI
    },
    [key: string]: undefined | object;
}

const OrderStack = createStackNavigator<OrderParamsList>();

export const OrderNavigator: React.FC = () => {
    const isAndroid = Device.osName === 'Android'
    return (
        <OrderStack.Navigator
            initialRouteName={OrderScreenName.ORDERS}
            screenOptions={{

            }}
        >
            <OrderStack.Screen
                component={OrderScreen}
                name={OrderScreenName.ORDERS}
                options={{
                    cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forVerticalIOS,
                    headerShown: true,
                    headerTitle: 'Orders',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerTitleStyle: tailwind('text-xl'),

                }}
            />
            <OrderStack.Screen
                component={UndeliveredSingleOrderScreen}
                name={OrderScreenName.UNDELIVERED_SINGLE_ORDER}
                options={{
                    cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forVerticalIOS,

                }}
            />
            <OrderStack.Screen
                component={SingleOrderScreen}
                name={OrderScreenName.DELIVERED_SINGLE_ORDER}
                options={{
                    cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forVerticalIOS,
                }}
            />
        </OrderStack.Navigator>
    );
};
