import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {AppNavigator} from "@screens/AppNavigator/AppNav";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";
import {useLoading} from "@contexts/loading.provider";
import {LoaderScreen} from "@components/commons/LoaderScreen";
import {ProfileProvider} from "@contexts/profile.provider";
import {ListingsProvider} from "@contexts/listing.provider";
import {LocationProvider} from "@contexts/location.provider";
import {CartProvider} from "@contexts/cart.provider";
import {OrdersProvider} from "@contexts/orders.provider";
import {AddressProvider} from "@contexts/address-book.provider";
import {VendorProvider} from "@contexts/vendor.provider";

export function RootNavigator (): JSX.Element {
    const {isAuthenticated} =  useAuthPersistence()
    const {isLoadingState} = useLoading()

    return (
        <>{isAuthenticated ? (
            <CartProvider>
            <LocationProvider>
            <ProfileProvider>
                <OrdersProvider>
                    <VendorProvider>
                    <AddressProvider>
                <ListingsProvider>
                    <AppNavigator />
                </ListingsProvider>
                    </AddressProvider>
                    </VendorProvider>
                </OrdersProvider>
            </ProfileProvider>
            </LocationProvider>
            </CartProvider>
        ) : <OnboardingNagivator />}
            {isLoadingState && <LoaderScreen />}
        </>
    )
}
