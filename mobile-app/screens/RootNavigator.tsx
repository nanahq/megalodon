import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {AppNavigator} from "@screens/AppNavigator/AppNav";
import * as SplashScreen from "expo-splash-screen";
import {useLogger} from "@contexts/NativeLoggingProvider";
import {useEffect} from "react";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";

export function RootNavigator (): JSX.Element {
    const logger = useLogger()
    const {isAuthenticated} =  useAuthPersistence()

    // Hide splashscreen when first page is loaded to prevent white screen
    useEffect(() => {
        SplashScreen.hideAsync().catch(logger.error);
    }, []);

    if (isAuthenticated) {
        return <AppNavigator />
    }

    return  (
        <OnboardingNagivator />
    )
}
