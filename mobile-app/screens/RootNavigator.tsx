import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {AppNavigator} from "@screens/AppNavigator/AppNav";
import * as SplashScreen from "expo-splash-screen";
import {useLogger} from "@contexts/NativeLoggingProvider";
import {useCachedResource} from "@hooks/useCachedResource";
import {OnboardingNagivator} from "./OnboardingNavigator/OnboardingNav";

export function RootNavigator (): JSX.Element {
    const logger = useLogger()
    const {isAuthenticated} =  useAuthPersistence()
    const isLoaded = useCachedResource()

    if (!isLoaded) {
        setTimeout(() => {
            SplashScreen.preventAutoHideAsync().catch(logger.error);
        }, 2000)
        return null as any;
    }


    if (isAuthenticated) {
        return <AppNavigator />
    }

    return  (
        <OnboardingNagivator />
    )
}
