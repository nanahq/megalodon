import {View, Text, ScrollView, TouchableOpacity} from 'react-native'
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
import {CartSwipeable} from "@screens/AppNavigator/Screens/basket/components/Swipable";
import {Trash2} from 'lucide-react-native'
import {useCart} from "@contexts/cart.provider";

export const BasketSingle: React.FC = () => {
    const navigation = useNavigation<NavigationProp<BasketParamsList>>()
    const {cart, removeCartItem} = useCart()

    const analytics = useAnalytics()

    useEffect(() => {
        void analytics.screen(BasketScreenName.SINGLE_BASKET)
    }, [])

    const totalCartValue = useMemo(() => {
        if (cart.cart !== undefined) {
            return cart.cart.reduce((total, cartItem) => {
                return total + Number(cartItem.totalValue);
            }, 0);
        }

        return 0
    }, [cart.cart])

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Basket",
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-2xl font-bold text-slate-900'),
            headerLeft: () => <ModalCloseIcon size={18} onPress={() => navigation.goBack()} />,
        })
    }, [])


    const onPress = () => {
        void analytics.track('CLICK:CHECKOUT', {
            cartValue: totalCartValue
        })
        navigation.navigate(BasketScreenName.CHECKOUT as any, {vendor: cart.vendor} as any)
    }

    const RenderDeleteButton: React.FC<any> = () => {
        return <TouchableOpacity onPress={() => undefined} style={[tailwind('flex flex-col justify-center p-4'), {height: 50, width: 50}]} >
               <Trash2 style={tailwind('text-red-600')} size={20} />
        </TouchableOpacity>
    }

    const deleteCartItem = (itemId: string): void => void removeCartItem(itemId)

    return (
       <View style={tailwind('flex-1 bg-white relative px-4')}>
           <ScrollView style={tailwind('flex-1 flex-col ')}>
               <View style={tailwind('flex flex-col mt-4')}>
                   <Text style={tailwind('text-lg text-slate-900 font-semibold')}>Order Items</Text>
                   <View style={tailwind('flex flex-col my-1.5')}>
                       {cart.cart?.map((_cart, index) => (
                           <CartSwipeable
                               key={`${_cart.cartItem._id}-${index}`}
                               renderRightActions={RenderDeleteButton}
                               deleteCartItem={() => deleteCartItem(`${_cart.cartItem._id}-${index}`)}
                           >
                               <SingleBaskedItem cart={_cart} />
                           </CartSwipeable>
                       ))}
                   </View>
                   <View style={tailwind('flex flex-row items-center justify-between mb-24 w-full')}>
                       <Text style={tailwind('text-slate-900 font-bold text-lg')}>Subtotal</Text>
                       <NumberFormat
                           prefix="₦"
                           value={totalCartValue}
                           thousandSeparator
                           displayType="text"
                           renderText={(value) => (
                               <Text style={tailwind("text-slate-900 font-bold text-lg")}>{value}</Text>
                           )}
                       />
                   </View>
               </View>
           </ScrollView>
           <GenericButton style={tailwind('absolute bottom-0 w-full self-center mb-10')} onPress={() => onPress()} label="Go to checkout" labelColor={tailwind('font-medium text-white')} backgroundColor={tailwind('bg-primary-100')} testId="" />
       </View>
    )
}
