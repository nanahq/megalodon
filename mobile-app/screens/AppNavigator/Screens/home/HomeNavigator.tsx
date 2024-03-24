import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {HomeScreen} from "@screens/AppNavigator/Screens/home/Home.Screen";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import * as Device from 'expo-device'
import {HomepageCategory} from "@screens/AppNavigator/Screens/home/Categories";
import {SingleCategoryScreen} from "@screens/AppNavigator/Screens/home/Category.screen";

export interface HomeParamsList {
    [HomeScreenName.SINGLE_CATEGORY]: {
        category: string
    }
    [key: string]: undefined | object;
}
const HomeStack = createStackNavigator<HomeParamsList>();

export function HomeNavigator(): JSX.Element {
    const isAndroid = Device.osName === 'Android'
    return (
        <HomeStack.Navigator
            initialRouteName={HomeScreenName.HOME}
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forVerticalIOS
            }}
        >

            <HomeStack.Screen
                component={HomeScreen}
                name={HomeScreenName.HOME}
                options={{
                    headerShown: false,
                }}
            />

            <HomeStack.Screen
                component={HomepageCategory}
                name={HomeScreenName.CATEGORIES_SCREEN}
                options={{
                    headerShown: false,
                }}
            />
            <HomeStack.Screen
                component={SingleCategoryScreen}
                name={HomeScreenName.SINGLE_CATEGORY}
                options={{
                    headerShown: false,
                }}
            />
        </HomeStack.Navigator>
    );
}
