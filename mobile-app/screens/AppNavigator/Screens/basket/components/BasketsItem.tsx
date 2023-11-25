import React, {memo, useMemo} from "react";
import {View, Text, Image} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {NumericFormat as NumberFormat} from "react-number-format";
import {Cart} from "@screens/AppNavigator/Screens/modals/Listing.Modal";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {deleteCartFromStorage, readCartFromStorage} from "@store/cart.reducer";
import {useAppDispatch} from "@store/index";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {BasketParamsList} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";

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
                <Image source={{uri: vendor?.businessImage,  cache: 'force-cache'}} style={tailwind('rounded-full w-20 h-20')} />
                 <View style={tailwind('w-2/3 ml-5')}>
                    <Text style={tailwind('font-medium text-2xl')}>{vendor?.businessName}</Text>
                    <View>
                        <View style={tailwind("flex flex-row items-center")}>
                            <Text style={tailwind('text-brand-gray-700 text-sm')}>{cart?.length} Items</Text>
                            <View style={tailwind('flex flex-row items-center')}>
                                <IconComponent iconType='AntDesign' name="tagso"  size={20} color={getColor('green-500')}/>
                                <NumberFormat
                                    prefix="₦"
                                    value={totalCartValue}
                                    thousandSeparator
                                    displayType="text"
                                    renderText={(value) => (
                                        <Text style={tailwind("text-sm text-brand-black-500")}>{value}</Text>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={tailwind('mt-5')}>
                <GenericButton onPress={() => navigation.navigate(BasketScreenName.SINGLE_BASKET)} label="View to Basket" labelColor={tailwind('text-white font-medium')} backgroundColor={tailwind('bg-black')} testId="" />
                <GenericButton onPress={() => handleDeleteCartItem()} style={tailwind(' mt-4')} label="Delete from basket" labelColor={tailwind('text-black font-medium')} backgroundColor={tailwind('bg-brand-ash')} testId="" />
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