import {View, Text} from "react-native";
import {tailwind} from "@tailwind";

export const PromotionScreen = () => {
    return (
        <View style={tailwind('flex-1 bg-white px-4 pt-20')}>
            <View style={tailwind('flex flex-col justify-center items-center')}>
                <Text>No promotions at the moment. Come back later</Text>
            </View>
        </View>
    )
}
