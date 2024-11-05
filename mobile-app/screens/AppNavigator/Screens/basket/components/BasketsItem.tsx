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
import {Tags, Trash2} from "lucide-react-native";
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
                            <Text style={tailwind('text-sltate-900 text-sm')}>{cart?.length} Items</Text>
                            <View style={tailwind('flex flex-row items-center')}>
                                <Tags  size={20} color={getColor('green-600')}/>
                                <NumberFormat
                                    prefix="₦"
                                    value={totalCartValue}
                                    thousandSeparator
                                    displayType="text"
                                    renderText={(value) => (
                                        <Text style={tailwind("text-sm ml-2 text-slate-900 font-normal")}>{value}</Text>
                                    )}
                                />
                            </View>
                        </View>
                    </View>
                </View>
            </View>
            <View style={tailwind('mt-5 flex flex-row items-center w-full')}>
                <GenericButton onPress={() => navigation.navigate(BasketScreenName.SINGLE_BASKET)} backgroundColor={tailwind('flex-grow')} label="View Basket" labelColor={tailwind('text-white')} />
                <Trash2 onPress={handleDeleteCartItem} size={20} style={tailwind('w-4 h-4 text-black mx-5')} />
            </View>
        </View>
    )
}


 const _SingleBaskedItem: React.FC<{cart: Cart}> = (props) => {
    return (
        <View style={tailwind('border-b-0.5 border-primary-50 py-3')}>
            <View style={tailwind('flex flex-row items-start w-full justify-between')}>
                <View style={tailwind('flex flex-row items-start mt-3')}>
                    <View style={tailwind(' rounded-full bg-primary-50 flex flex-row items-center justify-center w-10 h-10')}>
                        <Text style={tailwind('text-primary-100 font-normal text-base')}>{props.cart.quantity}</Text>
                    </View>
                    <View style={tailwind('flex flex-col ml-2')}>
                        <Text style={tailwind('text-slate-900 font-normal text-base')}>{props.cart.cartItem.name}</Text>
                        {props.cart.options.length > 0 && (
                          <View style={tailwind('flex flex-row flex-wrap mt-2')}>
                              <Text style={tailwind('text-xs font-normal text-slate-900')}>Options:</Text>
                              { props.cart.options.map((option, index) => (
                                  <Text key={index} style={tailwind('text-slate-900 font-normal text-xs')}> [{option.name} <NumberFormat
                                      prefix="+₦"
                                      value={option.price}
                                      thousandSeparator
                                      displayType="text"
                                      renderText={(value) => (
                                          <Text style={tailwind("text-xs font-normal text-slate-900")}>{value}</Text>
                                      )}
                                  /> ]</Text>
                              ))}
                        </View>
                        )}
                        <View style={tailwind('flex mt-3 flex-row items-center w-full justify-between')}>
                            <NumberFormat
                                prefix="₦"
                                value={props.cart.totalValue}
                                thousandSeparator
                                displayType="text"
                                renderText={(value) => (
                                    <Text style={tailwind("text-xs font-normal text-primary-100")}>{value}</Text>
                                )}
                            />
                        </View>
                    </View>
                </View>
                <View style={tailwind('w-1/5 flex flex-row justify-end')}>
                    <Image source={{uri: props.cart.cartItem.photo, cache: 'force-cache'}} style={tailwind('rounded-lg')} height={50} width={50} />
                </View>
            </View>
        </View>
    )
}

export const SingleBaskedItem = memo(_SingleBaskedItem)
