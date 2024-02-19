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
import {StoreProvider} from "@store/StoreProvider";
import {BottomSheetModalProvider} from "@gorhom/bottom-sheet";
import {SafeAreaProvider} from "react-native-safe-area-context";
import {WebSocketProvider} from "@contexts/SocketProvider";
import {NetworkMapper} from "@api/network.mapper";
import {createClient, AnalyticsProvider} from "@segment/analytics-react-native";
import {AmplitudeSessionPlugin} from "@segment/analytics-react-native-plugin-amplitude-session";

import 'expo-dev-client';

const WEBSOCKET_ENDPOINT = NetworkMapper.PRODUCTION

const segmentClient = createClient({
    writeKey: "2mQ9kjV6aBMDEJqDrJHzcG5afX5eOPWr",
    trackAppLifecycleEvents: true,
});

segmentClient.add({ plugin: new AmplitudeSessionPlugin()});

export default function App() {
  const isLoaded = useCachedResource()
   const logger = useLogger()


// delay splash screen till cached resources are loaded
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
               <WebSocketProvider socketEndpoint={WEBSOCKET_ENDPOINT}>
                   <StoreProvider>
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
                   </StoreProvider>
               </WebSocketProvider>
           </AuthPersistenceProvider>
       </ErrorBoundary>
    </NativeLoggingProvider>
  );
}
