import {SearchBar} from "@screens/AppNavigator/components/SearchBar";
import {View} from "react-native";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {tailwind} from "@tailwind";

export function SearchScreen (): JSX.Element {
    const {top: topInsert } = useSafeAreaInsets()
    return (
       <View style={[tailwind('px-4'), {paddingTop: topInsert + 5}]}>
           <SearchBar testID="SearchScreen.Bar" />
       </View>
    )
}
