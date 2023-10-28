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

export default function App() {
  const isLoaded = useCachedResource()
   const logger = useLogger()


   // delay splashscreen till cached resources are loaded
  if (!isLoaded) {
    SplashScreen.preventAutoHideAsync().catch(logger.error);
    return null;
  }

    const customToast = {
        app_toast_success: (toast: ToastProps) => <AppToast  type="success" toast={toast} />,
        app_toast_error: (toast: ToastProps) => <AppToast type="error" toast={toast} />,
    };


    return (
    <NativeLoggingProvider>
       <ErrorBoundary>
           <AuthPersistenceProvider
               api={{
                   ...persistence
               }}
           >
               <StoreProvider>
                   <GestureHandlerRootView
                       style={tailwind('flex-1')}
                   >
                       <ToastProvider renderType={customToast}>
                           <MainScreen />
                       </ToastProvider>
                   </GestureHandlerRootView>
               </StoreProvider>
           </AuthPersistenceProvider>
       </ErrorBoundary>
    </NativeLoggingProvider>
  );
}
