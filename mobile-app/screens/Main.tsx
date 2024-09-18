import {StatusBar} from 'expo-status-bar'
import {SafeAreaProvider} from 'react-native-safe-area-context'
import {RootNavigator} from "@screens/RootNavigator";
import { getColor} from '@tailwind'
export function MainScreen (): JSX.Element {

    return (
        <SafeAreaProvider>
            <StatusBar backgroundColor={"transparent"} />
            <RootNavigator />
        </SafeAreaProvider>
    )
}
