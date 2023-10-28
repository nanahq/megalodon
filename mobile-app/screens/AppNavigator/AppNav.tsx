import {createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomTabNavigator";
import * as Linking from "expo-linking"


const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    App: undefined
    [key: string]: undefined | Object
}
export function AppNavigator(): JSX.Element {

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
