import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {AppNavigator} from "@screens/AppNavigator/AppNav";
import * as SplashScreen from "expo-splash-screen";
import {useLogger} from "@contexts/NativeLoggingProvider";
import {useEffect} from "react";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";
import * as Location from "expo-location";
import {LocationCoordinates, UpdateUserDto} from "@nanahq/sticky";
import {PermissionStatus} from "expo-modules-core/src/PermissionsInterface";
import {_api} from "@api/_request";

export function RootNavigator (): JSX.Element {
    const logger = useLogger()
    const {isAuthenticated} =  useAuthPersistence()

    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
        void requestLocation()
    }, []);

    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();


        if (status !== PermissionStatus.GRANTED) {
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
            return undefined
        }
    }
    if (isAuthenticated) {
        return <AppNavigator />
    }

    return  (
        <OnboardingNagivator />
    )
}
