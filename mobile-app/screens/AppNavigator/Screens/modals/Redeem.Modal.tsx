import {View} from "react-native";
import {tailwind} from "@tailwind";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import React, {useEffect} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";

interface RedeemModalProps {
    callBack?: () => void
}


export const RedeemModal: React.FC<RedeemModalProps> = () => {
    const navigation = useNavigation<NavigationProp<any>>()

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Redeem Gift Card',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-2xl font-bold  text-slate-900'),
            headerStyle:  {
                shadowOpacity: 8,
                shadowRadius: 12,
            },
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.navigate(HomeScreenName.HOME, {})} />,
        })
    }, [])
    return (
        <View style={tailwind('flex-1 bg-white')}>
            <View />
        </View>
    )
}
