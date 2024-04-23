import React, {memo, useMemo} from "react";
import {View, Text, Image} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {NumericFormat as NumberFormat} from "react-number-format";
import {Cart} from "@screens/AppNavigator/Screens/modals/Listing.Modal";
import {GenericButton, GenericIconButton} from "@components/commons/buttons/GenericButton";
import {deleteCartFromStorage, readCartFromStorage} from "@store/cart.reducer";
import {useAppDispatch} from "@store/index";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {BasketParamsList} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {Tags, Trash} from "lucide-react-native";
import FastImage from "react-native-fast-image";

export const BasketsItem: React.FC<{cart: Cart[], vendor: any}> = ({cart, vendor}) => {
    const navigation = useNavigation<NavigationProp<BasketParamsList>>()
    const dispatch = useAppDispatch()
    const totalCartValue = useMemo(() => {
        if (cart !== undefined) {
            return cart.reduce((total, cartItem) => {
                const basePrice = Number(cartItem.cartItem.price) * cartItem.quantity;
                const optionPrice = cartItem.options.reduce((totalOptionsPrice, option) => {
                    return totalOptionsPrice + Number(option.price);
                }, 0);
                const itemTotalValue = basePrice + optionPrice;
                return total + itemTotalValue;
            }, 0);
        }

        return 0
    }, [cart])

    const handleDeleteCartItem = (): void => {
        dispatch(deleteCartFromStorage())
        dispatch(readCartFromStorage())
    }

    return (
        <View style={tailwind('border-0.5 border-brand-gray-700 rounded-lg px-3 py-5 mt-10')}>
            <View style={tailwind('flex flex-row items-start')}>
                <FastImage source={{uri: vendor?.businessLogo}} style={tailwind('rounded-full w-16 h-16')} />
                 <View style={tailwind('w-2/3 ml-5')}>
                    <Text style={tailwind('font-medium text-2xl')}>{vendor?.businessName}</Text>
                    <View>
                        <View style={tailwind("flex flex-row items-center")}>
                            <Text style={tailwind('text-brand-gray-700 text-sm')}>{cart?.length} Items</Text>
                            <View style={tailwind('flex flex-row items-center')}>
                                <Tags  size={20} color={getColor('green-600')}/>
                                <NumberFormat
                                    prefix="₦"
                                    value={totalCartValue}
                                    thousandSeparator
                                    displayType="text"
                                    renderText={(value) => (
                                        <Text style={tailwind("text-sm ml-2 text-brand-black-500")}>{value}</Text>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={tailwind('mt-5 flex flex-row w-full')}>
                <GenericButton onPress={() => navigation.navigate(BasketScreenName.SINGLE_BASKET)} backgroundColor={tailwind('flex-grow')} label="View to Basket" labelColor={tailwind('text-white')} />
               <GenericIconButton
                    backgroundColor={tailwind('ml-2')}
                   onPress={() => handleDeleteCartItem()}
               >
                   <Trash  style={tailwind('w-4 h-4 text-white mx-5')} color="#ffffff" />
               </GenericIconButton>
            </View>
        </View>
    )
}


 const _SingleBaskedItem: React.FC<{cart: Cart}> = (props) => {
    return (
        <View style={tailwind('border-b-0.5 border-brand-gray-700 py-5')}>
            <View style={tailwind('flex flex-row items-start w-full justify-between')}>
                <View>
                    <Text style={tailwind('text-gray-600 font-bold text-lg')}>{props.cart.cartItem.name}</Text>
                    <View style={tailwind('flex flex-row flex-wrap')}>
                        <Text>Options:: </Text>
                        {props.cart.options.length > 0 && props.cart.options.map((option, index) => (
                            <Text key={index} style={tailwind('text-brand-gray-700')}>| {option.name} </Text>
                        ))}
                    </View>
                </View>
                <Image source={{uri: props.cart.cartItem.photo, cache: 'force-cache'}} style={tailwind('rounded-lg')} height={50} width={50} />
            </View>
            <View>
                <View style={tailwind('flex mt-3 flex-row items-center w-full justify-between')}>
                    <Text>Quantity: {props.cart.quantity}</Text>
                    <NumberFormat
                        prefix="₦"
                        value={props.cart.totalValue}
                        thousandSeparator
                        displayType="text"
                        renderText={(value) => (
                            <Text style={tailwind("text-sm text-brand-black-500")}>{value}</Text>
                        )}
                    />
                </View>
            </View>
        </View>
    )
}

export const SingleBaskedItem = memo(_SingleBaskedItem)
