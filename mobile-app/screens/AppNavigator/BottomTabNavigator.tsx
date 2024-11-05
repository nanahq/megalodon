import { Text, View } from 'react-native';
import { getColor, tailwind } from "@tailwind";
import { AppScreenName } from "@screens/AppNavigator/ScreenName.enum";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import * as Device from 'expo-device';
import { OrderNavigator } from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ReceiptText, Home, Salad, Store, PackageOpen, User } from "lucide-react-native";
import { FoodScreen } from "@screens/AppNavigator/Screens/home/Food.screen";
import { MartScreen } from "@screens/AppNavigator/Screens/home/Mart.screen";
import { CourierScreen } from "@screens/AppNavigator/Screens/home/Courier.screen";
import React from "react";
import { useNavigation } from "@react-navigation/native";
import { HomeScreen } from "@screens/AppNavigator/Screens/home/Home.Screen";
import { CardStyleInterpolators } from "@react-navigation/stack";
import {HomeNavigator} from "@screens/AppNavigator/Screens/home/HomeNavigator";

export type BottomTabParamList = {
    [AppScreenName.HOME]: undefined;
    [AppScreenName.FOOD]: undefined;
    [AppScreenName.MART]: undefined;
    [AppScreenName.ORDERS]: undefined;
    [AppScreenName.Courier]: undefined;
    [AppScreenName.PROFILE]: undefined;
    [AppScreenName.DEALS]: undefined;
    [AppScreenName.BASKET]: undefined;
};

const BottomTab = createBottomTabNavigator<BottomTabParamList>();

interface TabBarLabelProps {
    focused: boolean;
    color: string;
    title: string;
}

const getTabBarLabel = ({ focused, color, title }: TabBarLabelProps): JSX.Element => (
    <Text
        style={[
            { color: focused ? getColor('primary-100') : getColor('slate-900') },
            tailwind("text-sm font-normal")
        ]}
    >
        {title}
    </Text>
);

interface TabIconProps {
    focused: boolean;
    color: string;
    size?: number;
    IconComponent: typeof Home | typeof Salad | typeof Store | typeof ReceiptText | typeof PackageOpen;
}

const TabIcon: React.FC<TabIconProps> = ({ focused, color, IconComponent, size = 26 }) => (
    <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
        <IconComponent size={size} color={focused ? getColor('primary-100') : color} />
    </View>
);

export function BottomTabNavigator(): JSX.Element {
    const insets = useSafeAreaInsets();
    const navigation = useNavigation<any>();
    const isAndroid = Device.osName?.toLowerCase().includes('android');

    const screenOptions: any  = {
        cardStyleInterpolator: isAndroid
            ? CardStyleInterpolators.forRevealFromBottomAndroid
            : CardStyleInterpolators.forVerticalIOS,
        headerShown: false,
        tabBarLabelPosition: "below-icon" as const,
        tabBarStyle: { height: insets.bottom + 80 },
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: '#B5B5B5',
        tabBarItemStyle: tailwind("pb-4 font-normal pt-1"),
    };



    return (
        <BottomTab.Navigator
            initialRouteName={AppScreenName.HOME}
            screenOptions={screenOptions}
        >
            <BottomTab.Screen
                name={AppScreenName.HOME}
                component={HomeNavigator}
                options={{
                    tabBarLabel: ({ focused, color }) => getTabBarLabel({ focused, color, title: 'Home' }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} color={color} IconComponent={Home} size={28} />
                    ),
                }}
            />
            <BottomTab.Screen
                name={AppScreenName.FOOD}
                component={FoodScreen}
                options={{
                    tabBarLabel: ({ focused, color }) => getTabBarLabel({ focused, color, title: 'Food' }),
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} color={color} IconComponent={Salad} size={28} />
                    ),
                }}
            />
            <BottomTab.Screen
                name={AppScreenName.MART}
                component={MartScreen}
                options={{
                    tabBarLabel: ({ focused, color }) => getTabBarLabel({ focused, color, title: 'Stores' }),
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} color={color} IconComponent={Store} />
                    ),
                }}
            />
            <BottomTab.Screen
                name={AppScreenName.ORDERS}
                component={OrderNavigator}
                options={{
                    headerShown: false,
                    tabBarStyle: { display: 'none' },
                    tabBarLabel: ({ focused, color }) => getTabBarLabel({ focused, color, title: 'Orders' }),
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} color={color} IconComponent={ReceiptText} />
                    ),
                }}
            />
            <BottomTab.Screen
                name={AppScreenName.Courier}
                component={CourierScreen}
                options={{
                    tabBarLabel: ({ focused, color }) => getTabBarLabel({ focused, color, title: 'Courier' }),
                    tabBarIcon: ({ focused, color }) => (
                        <TabIcon focused={focused} color={color} IconComponent={PackageOpen} />
                    ),
                }}
            />
        </BottomTab.Navigator>
    );
}

// Deep linking configuration
export const linking = {
    prefixes: [
        'nanaDelivery://',
        'https://trynanaapp.com',
    ],
    config: {
        screens: {
            [AppScreenName.HOME]: {
                path: 'home',
                screens: {
                    HomeScreen: '',
                }
            },
            [AppScreenName.FOOD]: {
                path: 'food',
                screens: {
                    FoodScreen: '',
                }
            },
            [AppScreenName.MART]: {
                path: 'mart',
                screens: {
                    MartScreen: '',
                }
            },
            [AppScreenName.ORDERS]: {
                path: 'orders',
                screens: {
                    OrdersScreen: '',
                    OrderDetails: 'order/:id',
                }
            },
            [AppScreenName.Courier]: {
                path: 'courier',
                screens: {
                    CourierScreen: '',
                }
            },
            [AppScreenName.DEALS]: {
                path: 'deals',
                screens: {
                    DealsScreen: '',
                }
            },
            [AppScreenName.PROFILE]: {
                path: 'profile',
                screens: {
                    ProfileScreen: '',
                    Settings: 'settings',
                    EditProfile: 'edit',
                }
            },
            [AppScreenName.BASKET]: {
                path: 'basket',
                screens: {
                    BasketScreen: '',
                    Checkout: 'checkout',
                }
            },
        },
    },
};
