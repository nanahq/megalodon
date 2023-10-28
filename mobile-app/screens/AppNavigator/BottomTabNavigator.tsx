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
                    "px-5 py-3 h-24 border-t bg-brand-black-500"),
                tabBarActiveTintColor: getColor("primary-500"),
                tabBarInactiveTintColor: '#ffffff',
                tabBarItemStyle: tailwind({ "pb-6 pt-2": Device.osName === 'iOS'}),
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
                        <IconComponent iconType='Feather' name="home"  size={24} color={color}/>
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
                        <IconComponent iconType='Feather' name="search"  size={24} color={color}/>
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
                            title: 'Orders',
                        }),
                    tabBarTestID: "BottomTabHome",
                    tabBarIcon: ({ color }) => (
                        <IconComponent iconType='MaterialIcons' name="takeout-dining"  size={24} color={color}/>
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
                        <IconComponent iconType='Feather' name="user"  size={24} color={color}/>
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

