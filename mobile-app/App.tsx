import 'expo-dev-client';
import * as SplashScreen from 'expo-splash-screen'
import {MainScreen} from "@screens/Main";
import {useCachedResource} from "@hooks/useCachedResource";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import {tailwind} from "@tailwind";
import {NativeLoggingProvider, useLogger} from "@contexts/NativeLoggingProvider";
import {AuthPersistenceProvider} from "@contexts/AuthPersistenceProvider";
import {persistence} from "@api/persistence";
import ErrorBoundary from "@screens/ErrorBoundary/ErrorBoundary";
import {ToastProps} from "react-native-toast-notifications/lib/typescript/toast";
import {AppToast} from "@components/commons/AppToast";
import {ToastProvider} from "react-native-toast-notifications";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {createClient, AnalyticsProvider} from "@segment/analytics-react-native";
import {AmplitudeSessionPlugin} from "@segment/analytics-react-native-plugin-amplitude-session";
import {PromoCodeProvider} from "@contexts/PromoCode";
import {LoadingProvider} from "@contexts/loading.provider";
import {io} from "socket.io-client";
import * as  firebase from '@react-native-firebase/app';
import * as  crashlytics from '@react-native-firebase/crashlytics';

import {
    CioLogLevel, CioRegion, CustomerIO, CioConfig, PushClickBehaviorAndroid
} from 'customerio-reactnative';
import {useEffect} from "react";

export const socket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {transports: ["websocket"]})

const segmentClient = createClient({
    writeKey: "2mQ9kjV6aBMDEJqDrJHzcG5afX5eOPWr",
    trackAppLifecycleEvents: true,
});

segmentClient.add({ plugin: new AmplitudeSessionPlugin()});

export default function App() {
  const isLoaded = useCachedResource()
   const logger = useLogger()

    if (!isLoaded) {
        setTimeout(() => {
            SplashScreen.preventAutoHideAsync().catch(logger.error);
        }, 2000)
        return null;
    }

    const customToast = {
        app_toast_success: (toast: ToastProps) => <AppToast  type="success" toast={toast} />,
        app_toast_error: (toast: ToastProps) => <AppToast type="error" toast={toast} />,
        app_toast_warning: (toast: ToastProps) => <AppToast type="warning" toast={toast} />,
    };

    useEffect(() => {
        const config: CioConfig = {
            cdpApiKey: '064b10f6a9b755367903', // Mandatory
            migrationSiteId: 'siteId', // Required if migrating from an earlier version
            region: CioRegion.US,
            logLevel: CioLogLevel.Debug,
            trackApplicationLifecycleEvents: true,
            inApp: {
                siteId: 'site_id',
            },
            push: {
                android: {
                    pushClickBehavior: PushClickBehaviorAndroid.ResetTaskStack
                }
            }
        };
        CustomerIO.initialize(config)
    }, [])

    return (
        <NativeLoggingProvider>
            <ErrorBoundary>
                <AuthPersistenceProvider
                    api={{
                        get: persistence.getSecure,
                        set: persistence.setSecure,
                        delete: persistence.deleteSecure
                    }}
                >
                       <LoadingProvider>
                               <PromoCodeProvider>
                                   <GestureHandlerRootView
                                       style={tailwind('flex-1')}
                                   >
                                       <SafeAreaProvider>
                                           <BottomSheetModalProvider>
                                               <ToastProvider renderType={customToast}>
                                                   <AnalyticsProvider client={segmentClient}>
                                                       <MainScreen />
                                                   </AnalyticsProvider>
                                               </ToastProvider>
                                           </BottomSheetModalProvider>
                                       </SafeAreaProvider>
                                   </GestureHandlerRootView>
                               </PromoCodeProvider>
                       </LoadingProvider>
                </AuthPersistenceProvider>
            </ErrorBoundary>
        </NativeLoggingProvider>
  );
}
