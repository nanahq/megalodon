import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomTabNavigator";
import * as Linking from "expo-linking"
import {fetchProfile, updateUserProfile} from "@store/profile.reducer";
import {useEffect, useRef, useState} from "react";
import {RootState, useAppDispatch} from "@store/index";
import {useSelector} from "react-redux";

import {fetchVendors} from "@store/vendors.reducer";
import {readCartFromStorage} from "@store/cart.reducer";
import {fetchAddressBook, fetchAddressLabels} from "@store/AddressBook.reducer";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {DeliveryFeeResult, ListingMenuI, LocationCoordinates, OrderI, UpdateUserDto, VendorUserI} from "@nanahq/sticky";
import {VendorModal} from "@screens/AppNavigator/Screens/modals/Vendor.Modal";
import {ListingModal} from "@screens/AppNavigator/Screens/modals/Listing.Modal";
import {AddAddressModal} from "@screens/AppNavigator/Screens/modals/AddAddress.Modal";
import {PaymentModal} from "@screens/AppNavigator/Screens/modals/Payment.Modal";
import * as Device from 'expo-device'
import * as Location from "expo-location";
import {_api} from "@api/_request";
import * as Notifications from "expo-notifications";
import {fetchAllCategories, fetchHomaPage} from "@store/listings.reducer";
import {RedeemModal} from "@screens/AppNavigator/Screens/modals/Redeem.Modal";
import {useAnalytics} from "@segment/analytics-react-native";
import {PromotionModal} from "@screens/AppNavigator/Screens/modals/Promotion.modal";
import Constants from "expo-constants";
import {ProfileNavigator} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {BasketNavigator} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import { DdRumReactNavigationTracking } from "@datadog/mobile-react-navigation";

const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    [ModalScreenName.MODAL_VENDOR_SCREEN]: {
        vendor: any,
        delivery?: DeliveryFeeResult
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

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,

    }),
});


if (Device.osName === 'Android') {
    void Notifications.setNotificationChannelAsync('default', {
        name: 'default',
        showBadge: true,
        enableLights: true,
        enableVibrate: true,
        sound: 'default',
        importance: Notifications.AndroidImportance.MAX,
        vibrationPattern: [0, 250, 250, 250],
        lightColor: '#FF231F7C',
    });
}



export function AppNavigator(): JSX.Element {
    const {profile} = useSelector((state: RootState) => state.profile)
    const notificationListener = useRef<any>();
    const responseListener = useRef<any>();
    const isAndroid  = Device.osName === 'Android'
    const dispatch = useAppDispatch()
    const analytics = useAnalytics()
    const navigationRef = useRef<any>(null)
    useEffect(() => {
        dispatch(fetchProfile() as any)
        dispatch(fetchVendors() as any)
        dispatch(readCartFromStorage() as any)
        dispatch(fetchAddressLabels() as any)
        dispatch(fetchAddressBook() as any)
        dispatch(fetchAllCategories() as any)
    }, [])

    useEffect(() => {
        if (profile && profile._id) {
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
        }
    }, [profile, profile._id])

    const requestLocation = async () => {
        const {status} = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted' ) {
            return
        }
        const {coords: {longitude, latitude}} = await Location.getCurrentPositionAsync({
            accuracy: 6
        });
        const location: LocationCoordinates = {
            type: 'Point',
            coordinates: [latitude, longitude]
        }
        try {

            await _api.requestData<Partial<UpdateUserDto>, undefined>({
                method: 'PUT',
                url: 'user/update',
                data: {location}
            })

        } catch (error: any) {
            throw error(error)
        }
    }

    useEffect(() => {
        void requestLocation()
    }, [])

    useEffect(() => {
        registerForPushNotificationsAsync().then((token: any) => {
            dispatch(updateUserProfile({expoNotificationToken: token}))
        });


        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            return response
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        };
    }, []);
    return (
        <NavigationContainer
            ref={navigationRef}
            onReady={() => {
                DdRumReactNavigationTracking.startTrackingViews(navigationRef.current)
            }}
            linking={LinkingConfiguration}>
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
                        name={ModalScreenName.MODAL_PAYMENT_SCREEN}
                        component={PaymentModal}
                    />
                    <App.Screen
                        name={ModalScreenName.MODAL_PROMO_SCREEN}
                        component={PromotionModal}
                    />
                </App.Group>
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
            },
            },
    },
};

async function registerForPushNotificationsAsync() {
    let token;

    if (Device.osName === 'Android') {
        await Notifications.setNotificationChannelAsync('default', {
            name: 'default',
            importance: Notifications.AndroidImportance.MAX,
            vibrationPattern: [0, 250, 250, 250],
            lightColor: '#FF231F7C',
        });
    }

    if (Device.isDevice) {
        const { status: existingStatus } = await Notifications.getPermissionsAsync();
        let finalStatus = existingStatus;
        if (existingStatus !== 'granted') {
            const { status } = await Notifications.requestPermissionsAsync();
            finalStatus = status;
        }
        if (finalStatus !== 'granted') {
            alert('You must grant permission to receive notifications on your order');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync({ projectId: Constants?.expoConfig?.extra?.eas?.projectId})).data;
    } else {
        alert('Must use physical device for Push Notifications');
    }

    return token;
}
