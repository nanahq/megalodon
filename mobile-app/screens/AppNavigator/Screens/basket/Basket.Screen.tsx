import {Image, ScrollView, View, Text} from "react-native";
import {tailwind} from "@tailwind";
import React, {memo, useEffect, useMemo} from "react";
import {BasketsItem} from "@screens/AppNavigator/Screens/basket/components/BasketsItem";
import EmptyCart from '@assets/app/nana-logo.png'
import {useAnalytics} from "@segment/analytics-react-native";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {useNavigation} from "@react-navigation/native";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {useCart} from "@contexts/cart.provider";
import {useVendor} from "@contexts/vendor.provider";

 const _BasketScreen: React.FC = () => {
    const {cart: cartState} = useCart()
    const {vendors} = useVendor()
     const analytics = useAnalytics()
     const navigation = useNavigation()
     useEffect(() => {
         void analytics.screen(BasketScreenName.BASKET)
         navigation.setOptions({
             headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />
         })

     }, [])

    const vendor = useMemo(() => {
        return vendors?.find((vendor) => vendor._id === cartState.vendor?._id)
    }, [vendors])
    return (
        <ScrollView style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('px-5 pb-20')}>
                {cartState.cart === undefined ? (
                    <View style={tailwind('flex  mt-16 flex-col items-center justify-center w-full')}>
                        <Image source={EmptyCart}  width={300} height={300} />
                        <View style={tailwind('flex flex-col items-center justify-center')}>
                            <Text style={tailwind('font-bold text-lg  mb-3 text-center')}>Add items to start a basket</Text>
                            <Text style={tailwind('text-brand-gray-700 text-center')}>
                                Once you add items from a restaurant, your basket will appear here.
                            </Text>
                        </View>
                    </View>
                    ) : (
                    <BasketsItem cart={cartState.cart as any} vendor={vendor as any}  />
                )}
            </View>
        </ScrollView>
    )
}
export const BasketScreen = memo(_BasketScreen)
