import {StackScreenProps} from "@react-navigation/stack";
import {HomeParamsList} from "@screens/AppNavigator/Screens/home/HomeNavigator";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {View} from "react-native";

type SingleCategoryScreenProps = StackScreenProps<HomeParamsList, HomeScreenName.SINGLE_CATEGORY>

export const SingleCategoryScreen: React.FC<SingleCategoryScreenProps> = ({route }) => {
    return (
        <View>

        </View>
    )
}
