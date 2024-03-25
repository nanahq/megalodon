import {Text, View} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import  * as Device from 'expo-device'
import {IconComponent} from "@components/commons/IconComponent";
import {HomeNavigator} from "@screens/AppNavigator/Screens/home/HomeNavigator";
import {RootState, useAppSelector} from "@store/index";
import {BasketNavigator} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import {ProfileNavigator} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {OrderNavigator} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {PromotionNavigator} from "@screens/AppNavigator/Screens/promotions/PromotionNavigator";
import {useSafeAreaInsets} from "react-native-safe-area-context";

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
    <Text style={{ color: props.focused ? getColor('primary-500') : props.color, ...tailwind("font-medium text-xs", {'mt-2': Device.osName === 'iOS'}) }}>
        {props.focused ? props.title : props.title}
    </Text>
);

export function BottomTabNavigator ():JSX.Element {
    const insert = useSafeAreaInsets()
    const {cart}  = useAppSelector((state: RootState) => state.cart)
    return (
        <BottomTab.Navigator
            initialRouteName={AppScreenName.HOME}
            screenOptions={{
                headerShown: false,
                tabBarLabelPosition: "below-icon",
                tabBarStyle: {height: insert.bottom + 80},
                tabBarActiveTintColor: '#ffffff',
                tabBarInactiveTintColor: '#B5B5B5',
                tabBarItemStyle: tailwind("pb-4 pt-1"),
                lazy: true
            }}
        >
            <BottomTab.Screen
                component={HomeNavigator}
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
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full', {'text-primary-500': focused})}>
                            <IconComponent iconType='AntDesign' name="home"  size={28} color={focused ? getColor('primary-500') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={BasketNavigator}
                name={AppScreenName.BASKET}
                options={{
                    tabBarStyle: {display: 'none'},
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Basket',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color , focused}) => (
                        <View style={tailwind('relative w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
                            <IconComponent iconType='Ionicons' name="ios-cart-outline"  size={26} color={focused ? getColor('primary-500') : color}/>
                            {cart !== undefined && (<View style={tailwind('absolute z-50 w-4 h-4 flex justify-center items-center rounded-full bg-black top-0 right-0')}>
                                <Text style={tailwind('text-xs text-white')}>{cart.length}</Text>
                            </View>)}
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={PromotionNavigator}
                name={AppScreenName.DEALS}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Deals',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
                            <IconComponent iconType='AntDesign' name="tagso"  size={26} color={focused ? getColor('primary-500') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={OrderNavigator}
                name={AppScreenName.ORDERS}
                options={{
                    tabBarStyle: {display: 'none'},
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Orders',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
                            <IconComponent iconType='Ionicons' name="fast-food-outline"  size={26} color={focused ? getColor('primary-500') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={ProfileNavigator}
                name={AppScreenName.PROFILE}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Profile',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color, focused }) => (
                        <View style={tailwind('w-10 h-10 flex flex-row items-center justify-center rounded-full')}>
                            <IconComponent iconType='AntDesign' name="user"  size={26} color={focused ? getColor('primary-500') : color}/>
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

