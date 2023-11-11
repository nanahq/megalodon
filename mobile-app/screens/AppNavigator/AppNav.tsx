import {CardStyleInterpolators, createStackNavigator} from "@react-navigation/stack";
import {LinkingOptions, NavigationContainer} from "@react-navigation/native";
import {AppLinking, BottomTabNavigator} from "@screens/AppNavigator/BottomTabNavigator";
import * as Linking from "expo-linking"
import {fetchProfile} from "@store/profile.reducer";
import {useEffect} from "react";
import {RootState, useAppDispatch} from "@store/index";
import {useSelector} from "react-redux";
import {LocationPermission} from "@screens/AppNavigator/components/LocationPersmission";
import {NotificationPermission} from "@screens/AppNavigator/components/NotificationPermission";
import {fetchVendors} from "@store/vendors.reducer";
import {readCartFromStorage} from "@store/cart.reducer";
import {fetchAddressBook, fetchAddressLabels} from "@store/AddressBook.reducer";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {ListingMenuI, OrderI, VendorUserI} from "@nanahq/sticky";
import {VendorModal} from "@screens/AppNavigator/Screens/modals/Vendor.Modal";
import {ListingModal} from "@screens/AppNavigator/Screens/modals/Listing.Modal";
import {AddAddressModal} from "@screens/AppNavigator/Screens/modals/AddAddress.Modal";
import {PaymentModal} from "@screens/AppNavigator/Screens/modals/Payment.Modal";
import * as Device from 'expo-device'

const App = createStackNavigator<AppParamList>()

export interface AppParamList {
    [ModalScreenName.MODAL_VENDOR_SCREEN]: {
        vendor: VendorUserI
    },

    [ModalScreenName.MODAL_LISTING_SCREEN]: {
        listing: ListingMenuI,
        isScheduled: boolean
    },

    [ModalScreenName.MODAL_ADD_ADDRESS_SCREEN]: {
        callback?: () => void,
    },

    [ModalScreenName.MODAL_PAYMENT_SCREEN]: {
        order: OrderI,
        paymentType?: 'BANK_TRANSFER' | 'USSD'
    },

    [key: string]: undefined | object;
}

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
    }, [])

    if (hasFetchedProfile && profile.location?.coordinates[0] === 0) {
        return <LocationPermission />
    }

    // if (hasFetchedProfile && profile.expoNotificationToken === undefined) {
    //     return <NotificationPermission/>
    // }

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
