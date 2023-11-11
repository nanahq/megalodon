import {Text, View} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {HomeScreen} from "@screens/AppNavigator/Screens/home/Home.Screen";
import  * as Device from 'expo-device'
import {IconComponent} from "@components/commons/IconComponent";
import {HomeNavigator} from "@screens/AppNavigator/Screens/home/HomeNavigator";
import {RootState, useAppSelector} from "@store/index";
import {BasketNavigator} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import {ProfileNavigator} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {OrderNavigator} from "@screens/AppNavigator/Screens/orders/OrderNavigator";

const BottomTab = createBottomTabNavigator<BottomTabParamList>()

export interface BottomTabParamList {
    Listings: undefined
    Orders: undefined
    Profile: undefined

    [key: string]: undefined | object
}
const getTabBarLabel = (props: {
    focused: boolean;
    color: string;
    title: string;
}): JSX.Element => (
    <Text style={{ color: props.color, ...tailwind("font-medium text-xs") }}>
        {props.focused ? props.title : props.title}
    </Text>
);


export function BottomTabNavigator ():JSX.Element {
    const {cart}  = useAppSelector((state: RootState) => state.cart)
    return (
        <BottomTab.Navigator
            initialRouteName={AppScreenName.HOME}
            screenOptions={{
                headerShown: false,
                tabBarLabelPosition: "below-icon",
                tabBarStyle: tailwind(
                    "h-28 border-t bg-white"),
                tabBarActiveTintColor: getColor("primary-500"),
                tabBarInactiveTintColor: '#B5B5B5',
                tabBarItemStyle: tailwind({
                    "pb-6": Device.osName === 'iOS',
                    "pb-8": Device.osName === 'Android'
                }),

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
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='AntDesign' name="home"  size={28} color={color}/>
                    ),
                }}
            />
            <BottomTab.Screen
                component={BasketNavigator}
                name={AppScreenName.BASKET}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Basket',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <View style={tailwind('relative')}>
                            <IconComponent iconType='Ionicons' name="ios-cart-outline"  size={28} color={color}/>
                            {cart !== undefined && (<View style={tailwind('absolute z-50 w-3 h-3 flex justify-center items-center rounded-full bg-green-500 top-0 right-0')}>
                                <Text style={tailwind('text-xs text-black')}>{cart.length}</Text>
                            </View>)}
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={HomeScreen}
                name={AppScreenName.DEALS}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Deals',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='AntDesign' name="tagso"  size={28} color={color}/>
                    ),
                }}
            />
            <BottomTab.Screen
                component={OrderNavigator}
                name={AppScreenName.ORDERS}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Orders',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='Ionicons' name="fast-food-outline"  size={28} color={color}/>
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
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='AntDesign' name="user"  size={28} color={color}/>
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

