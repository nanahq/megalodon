import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomTabNavigator";
import * as Linking from "expo-linking"
import {fetchProfile} from "@store/profile.reducer";
import {useEffect} from "react";
import {RootState, useAppDispatch} from "@store/index";
import {useSelector} from "react-redux";
import {
    registerForPushNotificationsAsync
} from "@screens/AppNavigator/components/NotificationPermission";
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
import {fetchHomaPage } from "@store/listings.reducer";


const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    [ModalScreenName.MODAL_VENDOR_SCREEN]: {
        vendor: VendorUserI,
        delivery?: DeliveryFeeResult
    },

    [ModalScreenName.MODAL_LISTING_SCREEN]: {
        listing: ListingMenuI,
        isScheduled: boolean,
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

    [key: string]: undefined | object;
}

Notifications.setNotificationHandler({
    handleNotification: async () => ({
        shouldShowAlert: true,
        shouldPlaySound: true,
        shouldSetBadge: true,

    }),
});


// if (Device.osName === 'Android') {
//     void Notifications.setNotificationChannelAsync('default', {
//         name: 'default',
//         showBadge: true,
//         enableLights: true,
//         enableVibrate: true,
//         sound: 'default',
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: '#FF231F7C',
//     });
// }


export function AppNavigator(): JSX.Element {
    const {profile, hasFetchedProfile} = useSelector((state: RootState) => state.profile)
    const isAndroid  = Device.osName === 'Android'
    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchProfile() as any)
        dispatch(fetchVendors() as any)
        dispatch(readCartFromStorage() as any)
        dispatch(fetchAddressLabels() as any)
        dispatch(fetchAddressBook() as any)
        dispatch(fetchHomaPage({type: "Point", coordinates:[0,0]}) as any)
    }, [])


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

            await _api.requestData<Partial<UpdateUserDto>>({
                method: 'PUT',
                url: 'user/update',
                data: {location}
            })

        } catch (error: any) {
            console.error(error)
        }
    }

    useEffect(() => {
        void requestLocation()

        if (hasFetchedProfile && profile.expoNotificationToken === undefined) {
            void requestPermission()
        }
    }, [])




    const requestPermission = async () => {
        const token = await registerForPushNotificationsAsync(requestPermission)
        const payload = {expoNotificationToken: token} as any
        await _api.requestData<Partial<UpdateUserDto>>({
            method: 'PUT',
            url: 'user/update',
            data: payload
        })
        dispatch(fetchProfile())
    }

    return (
        <NavigationContainer linking={LinkingConfiguration}>
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
                    <App.Screen
                        name={ModalScreenName.MODAL_ADD_ADDRESS_SCREEN}
                        component={AddAddressModal}
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
