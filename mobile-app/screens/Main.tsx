import {StatusBar} from 'expo-status-bar'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {RootNavigator} from "@screens/RootNavigator";
export function MainScreen (): JSX.Element {
    return (
        <SafeAreaProvider>
            <StatusBar backgroundColor={"transparent"} />
            <RootNavigator />
        </SafeAreaProvider>
    )
}
