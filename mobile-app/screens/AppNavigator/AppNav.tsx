import * as Device from 'expo-device'
import * as Location from "expo-location";
import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import { NavigationContainer} from "@react-navigation/native";
import {BottomTabNavigator, linking} from "@screens/AppNavigator/BottomTabNavigator";
import {useEffect, useRef} from "react";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {DeliveryFeeResult, ListingMenuI, OrderI, VendorUserI} from "@nanahq/sticky";
import {VendorModal} from "@screens/AppNavigator/Screens/modals/Vendor.Modal";
import {ListingModal} from "@screens/AppNavigator/Screens/modals/Listing.Modal";
import {AddAddressModal} from "@screens/AppNavigator/Screens/modals/AddAddress.Modal";
import {PaymentModal} from "@screens/AppNavigator/Screens/modals/Payment.Modal";
import {RedeemModal} from "@screens/AppNavigator/Screens/modals/Redeem.Modal";
import {useAnalytics} from "@segment/analytics-react-native";
import {PromotionModal} from "@screens/AppNavigator/Screens/modals/Promotion.modal";
import {ProfileNavigator} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {BasketNavigator} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import {useProfile} from "@contexts/profile.provider";
import {useLocation} from "@contexts/location.provider";
import {LocationPermission} from "@screens/AppNavigator/components/LocationPersmission";
import Constants from "expo-constants";
import {useCart} from "@contexts/cart.provider";
import {BoxDeliveryAddress} from "@screens/AppNavigator/Screens/modals/box-delivery-address";
import {SuccessScreen} from "@screens/AppNavigator/Screens/modals/success-screen";
import {CustomerIO} from 'customerio-reactnative'
const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    [ModalScreenName.MODAL_VENDOR_SCREEN]: {
        vendor: any,
        delivery?: DeliveryFeeResult
    },

    [ModalScreenName.MODAL_BOX_SCREEN]: {
        deliveryType: "SEND" | "RECEIVE",
    },
    [ModalScreenName.MODAL_LISTING_SCREEN]: {
        listing: ListingMenuI
        vendor: VendorUserI
        isScheduled: boolean
        availableDate?: number
    },

    [ModalScreenName.MODAL_ADD_ADDRESS_SCREEN]: {
        callback?: () => void,
    },

    [ModalScreenName.MODAL_PAYMENT_SCREEN]: {
        order: OrderI,
        meta:  {
            authorization_url?: string,
            reference: string
        }
    },

    [ModalScreenName.MODAL_REDEEM_SCREEN]: {
       callback?: () => void
    },

    [key: string]: undefined | object;
}

export function AppNavigator(): JSX.Element {
    const {profile, fetched} = useProfile()
    const isAndroid  = Device.osName === 'Android'
    const {locationPermission} = useLocation()
    const {readCart} = useCart()
    const analytics = useAnalytics()
    const navigationRef = useRef<any>(null)

    useEffect(() => {
        void readCart()
    }, [])

    useEffect(() => {
        if (fetched && profile?._id) {
            void analytics.identify(profile._id, {
                firstName: profile?.firstName,
                lastName: profile?.lastName,
                email: profile.email,
                phone: profile.phone,
                location: profile.location?.coordinates,
                device: {
                    version: Device.osVersion,
                    name: Device.osName,
                    brand: Device.brand
                }
            })

            CustomerIO.identify({
                userId: profile._id,
                traits: {
                    first_name: profile.firstName,
                    last_name: profile.lastName,
                    phone_number: profile.phone,
                    email: profile.email,
                    version: Device.osVersion,
                    name: Device.osName,
                    brand: Device.brand
                },
            });
        }
    }, [profile])


    if(locationPermission !== Location.PermissionStatus.GRANTED) {
        return <LocationPermission />
    }


    return (
        <NavigationContainer
            ref={navigationRef}
            linking={linking}>
            <App.Navigator screenOptions={{
                headerShown: false
            }}>
                <App.Group screenOptions={{
                    cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forRevealFromBottomAndroid : CardStyleInterpolators.forHorizontalIOS,
                    cardShadowEnabled: true,
                    cardOverlayEnabled: true,
                    animationEnabled: true,
                }}>
                    <App.Screen component={BottomTabNavigator} name="App" />
                    <App.Screen component={ProfileNavigator} name="Profile" />
                    <App.Screen component={BasketNavigator} name="Basket" />
                </App.Group>

                <App.Group
                    screenOptions={{
                        cardStyleInterpolator: isAndroid ? CardStyleInterpolators.forRevealFromBottomAndroid : CardStyleInterpolators.forHorizontalIOS,
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
                        name={ModalScreenName.MODAL_SUCCESS_SCREEN}
                        component={SuccessScreen}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_BOX_SCREEN}
                        component={BoxDeliveryAddress}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_LISTING_SCREEN}
                        component={ListingModal}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_REDEEM_SCREEN}
                        component={RedeemModal}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_ADD_ADDRESS_SCREEN}
                        component={AddAddressModal}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_PROMO_SCREEN}
                        component={PromotionModal}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_PAYMENT_SCREEN}
                        component={PaymentModal}
                    />
                </App.Group>
            </App.Navigator>
        </NavigationContainer>
    );
}
