import {Text} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {createBottomTabNavigator} from "@react-navigation/bottom-tabs";
import {ListingsScreen} from "@screens/AppNavigator/Screens/listings/Home.Screen";
import  * as Device from 'expo-device'
import {IconComponent} from "@components/commons/IconComponent";
import {SearchScreen} from "@screens/AppNavigator/Screens/listings/SearchScreen";

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
    return (
        <BottomTab.Navigator
            initialRouteName={AppScreenName.LISTINGS}
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

            }}
        >
            <BottomTab.Screen
                component={ListingsScreen}
                name={AppScreenName.LISTINGS}
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
                component={SearchScreen}
                name={AppScreenName.SEARCH}
                options={{
                    tabBarLabel: ({ focused, color }) =>
                        getTabBarLabel({
                            focused,
                            color,
                            title: 'Search',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='AntDesign' name="search1"  size={28} color={color}/>
                    ),
                }}
            />
            <BottomTab.Screen
                component={SearchScreen}
                name={AppScreenName.ORDERS}
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
                component={SearchScreen}
                name={AppScreenName.HOME}
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
                component={SearchScreen}
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
    [AppScreenName.LISTINGS]: {
        screens: {
            ListingsScreen: AppScreenName.LISTINGS,
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
    [AppScreenName.SEARCH]: {
    screens: {
        SearchScreen: AppScreenName.SEARCH,
    },
},
};

