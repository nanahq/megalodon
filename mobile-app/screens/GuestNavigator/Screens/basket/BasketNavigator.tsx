import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {BasketScreenName} from "@screens/GuestNavigator/Screens/basket/BasketScreenName.enum";
import {tailwind} from "@tailwind";
import * as Device from 'expo-device'
import {BasketScreen} from "@screens/GuestNavigator/Screens/basket/Basket.Screen";
import {BasketSingle} from "@screens/GuestNavigator/Screens/basket/Basket.single";

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
                    headerTitle: 'Basket',
                    headerTitleStyle:tailwind('font-bold text-2xl')
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


        </BasketStack.Navigator>
    );
}
