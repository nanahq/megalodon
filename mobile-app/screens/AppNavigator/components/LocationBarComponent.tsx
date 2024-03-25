import {Text, View} from "react-native";
import {tailwind} from "@tailwind";

export function LocationBarComponent (): JSX.Element {
    return (
        <View style={tailwind('flex w-full justify-center items-center')}>
           <View style={tailwind('flex flex-row items-center')}>
               <Text style={tailwind('font-medium text-base text-brand-black-500')}>Delivery Within -</Text>
               <Text style={tailwind('font-semibold text-base text-brand-black-500')}>Kano</Text>
           </View>
        </View>
    )
}
