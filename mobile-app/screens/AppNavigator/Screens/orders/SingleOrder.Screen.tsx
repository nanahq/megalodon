import {ScrollView, View, Text} from "react-native";
import {tailwind} from "@tailwind";
import { StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import React, {useEffect} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";


type SingleOrderScreenProps = StackScreenProps<OrderParamsList, OrderScreenName.DELIVERED_SINGLE_ORDER>
export const SingleOrderScreen: React.FC<SingleOrderScreenProps> = ({navigation, route}) => {

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Order #${route?.params?.order.refId}`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        })
    }, [])

    return (
        <ScrollView style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('px-4')}>
                <Text>{route.params.order.vendor.businessName}</Text>
            </View>
        </ScrollView>
    )
}
