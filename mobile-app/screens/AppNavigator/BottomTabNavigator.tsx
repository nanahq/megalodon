import {Pressable, Text, View} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import  * as Device from 'expo-device'
import {OrderNavigator} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {ReceiptText, Home, Salad, Store, PackageOpen, User} from "lucide-react-native";
import {FoodScreen} from "@screens/AppNavigator/Screens/home/Food.screen";
import {MartScreen} from "@screens/AppNavigator/Screens/home/Mart.screen";
import {CourierScreen} from "@screens/AppNavigator/Screens/home/Courier.screen";
import React from "react";
import {useNavigation} from "@react-navigation/native";
import {HomeScreen} from "@screens/AppNavigator/Screens/home/Home.Screen";
import {CardStyleInterpolators} from "@react-navigation/stack";
const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export interface BottomTabParamList {
    Listings: undefined
    Orders: undefined
    Profile: undefined

    Promotions: undefined

    [key: string]: undefined | object
}
const getTabBarLabel = (props: {
    focused: boolean;
    color: string;
    title: string;
}): JSX.Element => (
    <Text style={{ color: props.focused ? getColor('primary-100') : props.color, ...tailwind("text-xs", {'mt-1': Device.osName === 'iOS'}) }}>
        {props.focused ? props.title : props.title}
    </Text>
);

export function BottomTabNavigator ():JSX.Element {
    const insert = useSafeAreaInsets()
    const navigation = useNavigation<any>()
    const isAndroid = Device.osName?.toLowerCase().includes('android')
    return (
        <BottomTab.Navigator
            initialRouteName={AppScreenName.HOME}
            screenOptions={{
                cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forRevealFromBottomAndroid : CardStyleInterpolators.forVerticalIOS,
                headerShown: false,
                tabBarLabelPosition: "below-icon",
                tabBarStyle: {height: insert.bottom + 80},
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#B5B5B5',
                tabBarItemStyle: tailwind("pb-4 pt-1"),
                lazy: true,
            }}
        >
            <BottomTab.Screen
                component={HomeScreen}
                name={AppScreenName.HOME}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Home',

                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full', {'text-primary-100': focused})}>
                            <Home name="home"  size={28} color={focused ? getColor('primary-100') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={FoodScreen}
                name={AppScreenName.FOOD}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Food',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color , focused}) => (
                        <View style={tailwind('relative w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
                            <Salad name="home"  size={28} color={focused ? getColor('primary-100') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={MartScreen}
                name={AppScreenName.MART}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Mart',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
                            <Store size={26} color={focused ? getColor('primary-100') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={OrderNavigator}
                name={AppScreenName.ORDERS}
                options={{
                    headerShown: false,
                    tabBarStyle: {display: 'none'},
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Orders',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full', focused && 'bg-primary-100')}>
                            <ReceiptText  size={26} color={focused ? getColor('primary-100') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={CourierScreen}
                name={AppScreenName.Courier}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Courier',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
                            <PackageOpen size={26} color={focused ? getColor('primary-100') : color}/>
                        </View>
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}


export const AppLinking = {
    [AppScreenName.DEALS]: {
        screens: {
            DealsScreen: AppScreenName.DEALS,
        },
    },

    [AppScreenName.ORDERS]: {
        screens: {
            OrdersScreen: AppScreenName.ORDERS,
        },
    },

    [AppScreenName.PROFILE]: {
        screens: {
            ProfileScreen: AppScreenName.PROFILE,
        },
    },
    [AppScreenName.BASKET]: {
    screens: {
        BasketScreen: AppScreenName.BASKET,
    },
},
};

