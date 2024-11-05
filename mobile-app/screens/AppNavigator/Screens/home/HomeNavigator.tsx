import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {HomeScreen} from "@screens/AppNavigator/Screens/home/Home.Screen";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import * as Device from 'expo-device'
import {HomepageCategory} from "@screens/AppNavigator/Screens/home/Categories";
import {SingleCategoryScreen} from "@screens/AppNavigator/Screens/home/Category.screen";
import {VendorUserI, UserHomePage} from "@nanahq/sticky";
import {HomepageSectionScreen} from "@screens/AppNavigator/Screens/home/components/Section";

export interface HomeParamsList {
    [HomeScreenName.CATEGORIES_SCREEN]: {
        heading: string,
        items: VendorUserI[]
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
                component={HomepageSectionScreen}
                name={HomeScreenName.CATEGORIES_SCREEN}
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
