import {Text, View} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {GuestAppScreenName} from "@screens/GuestNavigator/ScreenName.enum";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import  * as Device from 'expo-device'
import {HomeNavigator} from "@screens/GuestNavigator/Screens/home/HomeNavigator";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {BasketNavigator} from "@screens/GuestNavigator/Screens/basket/BasketNavigator";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import { Pizza, ShoppingBasket, History, CircleUser} from "lucide-react-native";
import {ProfileScreen} from "@screens/GuestNavigator/Screens/profile/Profile.Screen";
import {OrderScreen} from "@screens/GuestNavigator/Screens/orders/Orders.Screen";
import {useEffect} from "react";
import {fetchVendors} from "@store/vendors.reducer";
import {readCartFromStorage} from "@store/cart.reducer";
import {fetchAllCategories, fetchHomaPage} from "@store/listings.reducer";

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
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchVendors() as any)
        dispatch(readCartFromStorage() as any)
        dispatch(fetchAllCategories() as any)
        dispatch(fetchHomaPage({type: "Point", coordinates:[0,0]}) as any)
    }, [])
    return (
        <BottomTab.Navigator
            initialRouteName={GuestAppScreenName.HOME}
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
                name={GuestAppScreenName.HOME}
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
                            <Pizza name="home"  size={28} color={focused ? getColor('primary-500') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={BasketNavigator}
                name={GuestAppScreenName.BASKET}
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
                            <ShoppingBasket size={26} color={focused ? getColor('primary-500') : color}/>
                            {cart !== undefined && (<View style={tailwind('absolute z-50 w-4 h-4 flex justify-center items-center rounded-full bg-black top-0 right-0')}>
                                <Text style={tailwind('text-xs text-white')}>{cart.length}</Text>
                            </View>)}
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={OrderScreen}
                name={GuestAppScreenName.ORDERS}
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
                            <History  size={26} color={focused ? getColor('primary-500') : color}/>
                        </View>
                    ),
                }}
            />
            <BottomTab.Screen
                component={ProfileScreen}
                name={GuestAppScreenName.PROFILE}
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
                            <CircleUser iconType='AntDesign' name="user"  size={26} color={focused ? getColor('primary-500') : color}/>
                        </View>
                    ),
                }}
            />
        </BottomTab.Navigator>
    )
}


export const AppLinking = {
    [GuestAppScreenName.DEALS]: {
        screens: {
            DealsScreen: GuestAppScreenName.DEALS,
        },
    },

    [GuestAppScreenName.ORDERS]: {
        screens: {
            OrdersScreen: GuestAppScreenName.ORDERS,
        },
    },

    [GuestAppScreenName.PROFILE]: {
        screens: {
            ProfileScreen: GuestAppScreenName.PROFILE,
        },
    },
    [GuestAppScreenName.BASKET]: {
    screens: {
        BasketScreen: GuestAppScreenName.BASKET,
    },
},
};

