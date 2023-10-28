import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {AppNavigator} from "@screens/AppNavigator/AppNav";
import {useEffect} from "react";
import * as SplashScreen from "expo-splash-screen";
import {useLogger} from "@contexts/NativeLoggingProvider";
import {useSelector} from "react-redux";
import {RootState, useAppDispatch} from "@store/index";
import {fetchProfile} from "@store/profile.reducer";
import {LocationPermission} from "@screens/AppNavigator/components/LocationPersmission";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";

export function RootNavigator (): JSX.Element {
    const logger = useLogger()
    const {isAuthenticated} =  useAuthPersistence()
    const {profile, hasFetchedProfile} = useSelector((state: RootState) => state.profile)

    // Hide splashscreen when first page is loaded to prevent white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);

    const dispatch = useAppDispatch()

    useEffect(() => {
        dispatch(fetchProfile() as any)
    }, [])

    if (isAuthenticated) {
        if (hasFetchedProfile && profile.location?.coordinates[0] === 0) {
            return <LocationPermission />
        }

        return <AppNavigator />
    }

    return  (
        <OnboardingNagivator />
    )
}
