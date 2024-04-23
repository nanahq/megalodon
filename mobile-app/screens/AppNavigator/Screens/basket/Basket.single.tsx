import {View, Text, ScrollView} from 'react-native'
import {RootState, useAppSelector} from "@store/index";
import {tailwind} from "@tailwind";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import React, {useEffect, useMemo} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {BasketParamsList} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {SingleBaskedItem} from "@screens/AppNavigator/Screens/basket/components/BasketsItem";
import {NumericFormat as NumberFormat} from "react-number-format";
import {useAnalytics} from "@segment/analytics-react-native";

export const BasketSingle: React.FC = () => {
    const navigation = useNavigation<NavigationProp<BasketParamsList>>()
    const vendors = useAppSelector((state: RootState) => state.vendors)
    const cart = useAppSelector((state: RootState) => state.cart)
    const analytics = useAnalytics()

    useEffect(() => {
        void analytics.screen(BasketScreenName.SINGLE_BASKET)
    }, [])
    const vendor = useMemo(() => {
        return vendors.vendors?.find((vendor) => vendor._id === cart.vendor?._id)
    }, [cart, vendors])


    const totalCartValue = useMemo(() => {
        if (cart.cart !== undefined) {
            return cart.cart.reduce((total, cartItem) => {
                const basePrice = Number(cartItem.cartItem.price) * cartItem.quantity;
                const optionPrice = cartItem.options.reduce((totalOptionsPrice, option) => {
                    return totalOptionsPrice + Number(option.price);
                }, 0);
                const itemTotalValue = basePrice + optionPrice;
                return total + itemTotalValue;
            }, 0);
        }

        return 0
    }, [cart.cart])

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: vendor?.businessName,
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitleStyle: tailwind('text-xl'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.navigate(BasketScreenName.BASKET)} />,
        })
    }, [])


    const onPress = () => {
        void analytics.track('CLICK:CHECKOUT', {
            cartValue: totalCartValue
        })
        navigation.navigate(BasketScreenName.CHECKOUT, {vendor: cart.vendor})
    }

    return (
       <View style={tailwind('flex-1 bg-white relative px-4')}>
           <ScrollView style={tailwind('flex-1 flex-col ')}>
               <View>
                   <View style={tailwind('flex flex-col my-3')}>
                       {cart.cart?.map((_cart, index) => (
                           <SingleBaskedItem cart={_cart} key={index + _cart.cartItem._id}/>
                       ))}
                   </View>
                   <View style={tailwind('flex flex-row items-center justify-between mb-24 w-full')}>
                       <Text style={tailwind('font-bold text-lg')}>Subtotal</Text>
                       <NumberFormat
                           prefix="₦"
                           value={totalCartValue}
                           thousandSeparator
                           displayType="text"
                           renderText={(value) => (
                               <Text style={tailwind("text-lg font-bold")}>{value}</Text>
                           )}
                       />
                   </View>
               </View>
           </ScrollView>
           <GenericButton style={tailwind('absolute bottom-0 w-full self-center mb-10')} onPress={() => onPress()} label="Go to checkout" labelColor={tailwind('font-medium text-white')} backgroundColor={tailwind('bg-black')} testId="" />
       </View>
    )
}
