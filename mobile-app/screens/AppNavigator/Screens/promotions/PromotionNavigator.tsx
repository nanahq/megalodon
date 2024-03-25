import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import * as Device from 'expo-device'
import {PromotionScreenName} from "@screens/AppNavigator/Screens/promotions/PromotionScreenName";
import {PromotionScreen} from "@screens/AppNavigator/Screens/promotions/PromotionScreen";
import {tailwind} from "@tailwind";

export interface PromotionParamsList {
    [key: string]: undefined | object;
}
const PromotionStack = createStackNavigator<PromotionParamsList>();

export function PromotionNavigator(): JSX.Element {
    const isAndroid = Device.osName === 'Android'
    return (
        <PromotionStack.Navigator
            initialRouteName={PromotionScreenName.PROMOTION_SCREEN}
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forVerticalIOS
            }}
        >

            <PromotionStack.Screen
                component={PromotionScreen}
                name={PromotionScreenName.PROMOTION_SCREEN}
                options={{
                    cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forVerticalIOS,
                    headerShown: true,
                    headerTitle: 'Deals & Promotions',
                    headerBackTitleVisible: false,
                    headerTitleAlign: 'center',
                    headerTitleStyle: tailwind('text-xl'),
                }}
            />

        </PromotionStack.Navigator>
    );
}
