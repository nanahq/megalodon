import 'expo-dev-client';
import * as SplashScreen from 'expo-splash-screen'
import {LoadCachedResourceAsync} from "@hooks/useCachedResource";
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
import {useEffect, useCallback, useState} from 'react'
import {
    CioLogLevel, CioRegion, CustomerIO, CioConfig, PushClickBehaviorAndroid
} from 'customerio-reactnative';

import * as Sentry from '@sentry/react-native';
import {StatusBar} from "expo-status-bar";
import {RootNavigator} from "@screens/RootNavigator";

SplashScreen.setOptions({
    duration: 1000,
    fade: true,
});


export const socket = io(`${process.env.EXPO_PUBLIC_API_URL}`, {transports: ["websocket"]})

const segmentClient = createClient({
    writeKey: "2mQ9kjV6aBMDEJqDrJHzcG5afX5eOPWr",
    trackAppLifecycleEvents: true,
});

segmentClient.add({ plugin: new AmplitudeSessionPlugin()});

 function App() {
     const [appIsReady, setAppIsReady] = useState(false);

     useEffect(() => {
         async function prepare() {
             try {
                 await SplashScreen.preventAutoHideAsync();
                 await LoadCachedResourceAsync;
                 await new Promise(resolve => setTimeout(resolve, 2000));
             } catch (e) {
                 console.warn(e);
             } finally {
                 setAppIsReady(true);
             }
         }

        void prepare();
     }, []);

     const onLayoutRootView = useCallback(() => {
         if (appIsReady) {
             SplashScreen.hide();
         }
     }, [appIsReady]);


     useEffect(() => {
         const config: CioConfig = {
             cdpApiKey: '064b10f6a9b755367903',
             region: CioRegion.EU,
             logLevel: CioLogLevel.Debug,
             trackApplicationLifecycleEvents: true,
             inApp: {
                 siteId: 'b4a0e8fbee0dfc9c46ca',
             },
             push: {
                 android: {
                     pushClickBehavior: PushClickBehaviorAndroid.ResetTaskStack
                 }

             }
         };
         void CustomerIO.initialize(config)
     }, [])


    const customToast = {
        app_toast_success: (toast: ToastProps) => <AppToast  type="success" toast={toast} />,
        app_toast_error: (toast: ToastProps) => <AppToast type="error" toast={toast} />,
        app_toast_warning: (toast: ToastProps) => <AppToast type="warning" toast={toast} />,
    };

     if (!appIsReady) {
         return null;
     }



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
                                       onLayout={onLayoutRootView}
                                   >
                                       <SafeAreaProvider>
                                           <BottomSheetModalProvider>
                                               <ToastProvider renderType={customToast}>
                                                   <AnalyticsProvider client={segmentClient}>
                                                       <SafeAreaProvider>
                                                           <StatusBar backgroundColor={"transparent"} />
                                                           <RootNavigator />
                                                       </SafeAreaProvider>
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

export default Sentry.wrap(App)
