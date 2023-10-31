import {createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomTabNavigator";
import * as Linking from "expo-linking"
import {fetchProfile} from "@store/profile.reducer";
import {useEffect} from "react";
import {RootState, useAppDispatch} from "@store/index";
import {useSelector} from "react-redux";
import {LocationPermission} from "@screens/AppNavigator/components/LocationPersmission";
import {NotificationPermission} from "@screens/AppNavigator/components/NotificationPermission";

const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    App: undefined
    [key: string]: undefined | Object
}
export function AppNavigator(): JSX.Element {
    const {profile, hasFetchedProfile} = useSelector((state: RootState) => state.profile)


    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchProfile() as any)
    }, [])

    if (hasFetchedProfile && profile.location?.coordinates[0] === 0) {
        return <LocationPermission />
    }

    // if (hasFetchedProfile && profile.expoNotificationToken === undefined) {
    //     return <NotificationPermission/>
    // }

    return (
        <NavigationContainer linking={LinkingConfiguration}>
            <App.Navigator screenOptions={{ headerShown: false }}>
                <App.Screen component={BottomTabNavigator} name="App" />
            </App.Navigator>
        </NavigationContainer>
    );
}

const LinkingConfiguration: LinkingOptions<ReactNavigation.RootParamList> = {
    prefixes: [Linking.createURL("/")],
    config: {
        screens: {
            App: {
                path: "app",
                screens: AppLinking,
            }
            },
    },
};
