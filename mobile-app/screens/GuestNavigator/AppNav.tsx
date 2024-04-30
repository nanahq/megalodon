import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import { BottomTabNavigator} from "@screens/GuestNavigator/BottomTabNavigator";
import {ModalScreenName} from "@screens/GuestNavigator/ScreenName.enum";
import {DeliveryFeeResult, ListingMenuI, VendorUserI} from "@nanahq/sticky";
import {VendorModal} from "@screens/GuestNavigator/Screens/modals/Vendor.Modal";
import {ListingModal} from "@screens/GuestNavigator/Screens/modals/Listing.Modal";
import * as Device from 'expo-device'

const App = createStackNavigator<GuestAppParamList>()

export interface GuestAppParamList {
    [ModalScreenName.MODAL_VENDOR_SCREEN]: {
        vendor: VendorUserI,
        delivery?: DeliveryFeeResult
    },

    [ModalScreenName.MODAL_LISTING_SCREEN]: {
        listing: ListingMenuI
        vendor: VendorUserI
        isScheduled: boolean
        availableDate?: number
    },

    [key: string]: undefined | object;
}

export function GuestAppNavigator(): JSX.Element {
    const isAndroid  = Device.osName === 'Android'
    return (
            <App.Navigator screenOptions={{
                headerShown: false,
            }}>
                <App.Group screenOptions={{
                    cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forRevealFromBottomAndroid : CardStyleInterpolators.forHorizontalIOS,
                    cardShadowEnabled: true,
                    cardOverlayEnabled: true,
                    animationEnabled: true,
                }}>
                    <App.Screen component={BottomTabNavigator} name="App" />
                </App.Group>
                <App.Group
                    screenOptions={{
                        headerShown: false,
                        presentation: 'modal',
                        cardShadowEnabled: true,
                        cardOverlayEnabled: true,
                        animationEnabled: true,
                    }}
                >
                    <App.Screen
                        name={ModalScreenName.MODAL_VENDOR_SCREEN}
                        component={VendorModal}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_LISTING_SCREEN}
                        component={ListingModal}
                    />
                </App.Group>
            </App.Navigator>
    );
}
