import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {tailwind} from "@tailwind";
import * as Device from 'expo-device'
import {BasketScreen} from "@screens/AppNavigator/Screens/basket/Basket.Screen";
import {BasketSingle} from "@screens/AppNavigator/Screens/basket/Basket.single";
import {Checkout} from "@screens/AppNavigator/Screens/basket/Checkout";

export interface BasketParamsList {
    [key: string]: undefined | object;
}
const BasketStack = createStackNavigator<BasketParamsList>();

export function BasketNavigator(): JSX.Element {
    const isAndroid = Device.osName === 'Android'
    const interpolator = isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forHorizontalIOS
    return (
        <BasketStack.Navigator
            initialRouteName={BasketScreenName.BASKET}
            screenOptions={{
                headerShown: false,
                cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forBottomSheetAndroid : CardStyleInterpolators.forVerticalIOS
            }}
        >

            <BasketStack.Screen
                component={BasketScreen}
                name={BasketScreenName.BASKET}
                options={{
                    headerShown: true,
                    headerTitle: 'Preview Order',
                    headerTitleStyle:tailwind('font-semibold text-slate-900 text-xl')
                }}
            />

            <BasketStack.Screen
                component={BasketSingle}
                name={BasketScreenName.SINGLE_BASKET}
                options={{
                    cardStyleInterpolator: interpolator,
                    headerShown: false,
                    cardShadowEnabled: true,
                    cardOverlayEnabled: true,
                    animationEnabled: true,
                }}
            />

            <BasketStack.Screen
                component={Checkout}
                name={BasketScreenName.CHECKOUT}
                options={{
                    cardStyleInterpolator: interpolator,
                    cardShadowEnabled: true,
                    cardOverlayEnabled: true,
                    animationEnabled: true,
                }}
            />

        </BasketStack.Navigator>
    );
}
