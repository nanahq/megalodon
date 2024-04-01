import React, {useEffect, useState} from "react";
import {ListingMenuI, ListingOption, ListingOptionGroupI} from "@nanahq/sticky";
import {useToast} from "react-native-toast-notifications";
import {_api} from "@api/_request";
import {showTost} from "@components/commons/Toast";
import { ScrollView, Text, TouchableOpacity, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {tailwind} from "@tailwind";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {ShareListingIcon} from "@screens/AppNavigator/Screens/modals/components/ShareListingIcon";
import {NumericFormat as NumberFormat} from "react-number-format";
import {ListingOptionSection} from "@screens/AppNavigator/Screens/modals/components/ListingOptionSection";
import {SkeletonLoader, SkeletonLoaderScreen} from "@components/commons/SkeletonLoaders/SkeletonLoader";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import { saveCartToStorage} from "@store/cart.reducer";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import { ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import moment from "moment";
import FastImage from "react-native-fast-image";
import {useAnalytics} from "@segment/analytics-react-native";

import {calculateTotalValue} from "../../../../../utils/CalculateCartTotal";
import {Minus, Plus} from "lucide-react-native";

type ListingModalScreenProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_LISTING_SCREEN>

export interface Cart {
    totalValue: number | string
    cartItem: ListingMenuI
    options: ListingOption[]

    quantity: number
}

export const ListingModal: React.FC<ListingModalScreenProps>  = ({navigation, route}) => {
    const {cart, hasItemsInCart, vendor: cartvendor, cartItemAvailableDate} = useAppSelector((state: RootState) => state.cart)

    const [_cart, setCart] = useState<Cart>({
        totalValue: route.params.listing.price,
        cartItem: route.params.listing,
        quantity: 1,
        options: [],
    });
    const [loading, setLoading] = useState<boolean>(true);
    const [hasRequiredOption, setRequiredOption] = useState<boolean>(false);
    const [listing, setListing] = useState<ListingMenuI | undefined>(undefined);
    const [selectedOptions, setSelectedOptions] = useState<ListingOption[]>([]);
    const [haveSelectedAllRequiredOptions, setRequiredOptions] = useState<boolean>(false)
    const toast = useToast();
    const dispatch = useAppDispatch()
    const [quantity, setQuantity] = useState(1);
    const analytics = useAnalytics()


    const handleIncrease = () => {
        void analytics.track('CLICK:QUANTITY-INCREASE')
        setQuantity(quantity + 1);
        setCart((prevCart) => ({
            ...prevCart,
            quantity: quantity + 1,
            totalValue: calculateTotalValue(quantity + 1, +route.params.listing.price, _cart.options),
        }));
    };

    const handleDecrease = () => {
        void analytics.track('CLICK:QUANTITY-DECREASE')
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setCart((prevCart) => ({
                ...prevCart,
                quantity: quantity - 1,
                totalValue: calculateTotalValue(quantity - 1, +route.params.listing.price, _cart.options),
            }));
        }
    };

    const onOptionValueChange = (_selectedOptions: {name: string, price: string, isSelected: boolean }[]) => {
        const mergedOptions = _selectedOptions.reduce((acc, option) => {
            if (option.isSelected) {
                const existingOptionIndex = acc.findIndex((existingOption) => existingOption.name === option.name);

                if (existingOptionIndex !== -1) {
                    acc[existingOptionIndex] = option;
                } else {
                    acc.push(option);
                }
            } else {
                acc = acc.filter((existingOption) => existingOption.name !== option.name);
            }

            return acc;
        }, selectedOptions)
        .map(s =>  ({name: s.name, price: s.price}))

        setSelectedOptions(mergedOptions);
        setCart((prevCart) => ({
            ...prevCart,
            options: mergedOptions,
            totalValue: calculateTotalValue(prevCart.quantity, +route.params.listing.price, mergedOptions),
        }));
    };


    useEffect(() => {
        void analytics.screen(ModalScreenName.MODAL_LISTING_SCREEN)
    }, [])

    useEffect(() => {
        async function fetchData () {
            try {
                const {data: _listing} = await _api.requestData<null, ListingMenuI>({
                    method: 'GET',
                    url: `listing/menu/${route.params.listing._id}`
                })

                setListing(_listing)
            } catch (error) {
                showTost(toast, 'Something went wrong fetching vendor', 'error')
            } finally {
                setLoading(false)
            }
        }

        if (loading) {
            void fetchData()
        }

    }, [route.params.listing._id])

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: route.params.listing.name,
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitleStyle: tailwind('text-xl'),
            headerRight: () => <ShareListingIcon  onPress={() => {}}/>,
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        })
    }, [])


    useEffect(() => {
        if (listing !== undefined && listing._id ) {
            const requiredOptions: ListingOptionGroupI[] = []

            for (const optionGroup of listing.optionGroups) {
                if (optionGroup.min > 0) {
                    requiredOptions.push(optionGroup)
                }
            }

            const options = requiredOptions.flatMap((group) => {
                return group.options.map( op => op)
            })

            const allRequiredOptionsSelected = options.some(({name}) =>
                selectedOptions.some((option) => option.name === name)
            );

            setRequiredOption(requiredOptions.length > 0)
            setRequiredOptions(allRequiredOptionsSelected)

        }
    }, [listing, selectedOptions])

    const addToBasket  = () => {
        if ( hasRequiredOption && !haveSelectedAllRequiredOptions) {
            showTost(toast, 'Please select required options', 'warning')
            return
        }


        if (route.params.isScheduled && cartItemAvailableDate) {
            const prevListing = moment(cartItemAvailableDate)
            const currentListing = moment(route.params.availableDate)

            if (prevListing.day() !== currentListing.day() || prevListing.month() !== currentListing.month()) {
                showTost(toast, 'Can not add items with different schedule dates', 'warning')
                return
            }
        }

        if (cartItemAvailableDate && !route.params.isScheduled ) {
            showTost(toast, 'Unable to add items. A pre-order listing from the same vendor is in your cart.', 'warning', 4000)
            return
        }

        if (Boolean(cart?.length)  && cartItemAvailableDate === undefined && route.params.isScheduled) {
            showTost(toast, 'Unable to add items. Remove existing items in cart to add a pre-order', 'warning', 4000)
            return
        }

        dispatch(saveCartToStorage({
            vendor: listing?.vendor  as any,
            cart: _cart,
            cartAvailableDate:  route.params.availableDate ?? undefined
        }))
        navigation.goBack()
        void analytics.track('CLICK:ADD-TO-CART-LISTING-MODAL')

    }

    const goToBasket = () => {
        void analytics.track('CLICK:VIEW-CART-LISTING-MODAL')
        setTimeout(() => {
            navigation.navigate(BasketScreenName.BASKET)
        }, 1000)
    }
    return (
        <View style={tailwind('flex-1  relative bg-white')}>
           <ScrollView style={tailwind('pb-10')}>
               <View style={tailwind('pb-5 mb-3 bg-white')}>
                   <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: route.params.listing.photo, priority: FastImage.priority.normal }} style={[tailwind("w-full"), { height: 170 }]} />
                   <View style={tailwind('px-4 flex flex-col mt-6')}>
                       <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                           <View style={tailwind('flex flex-col w-3/4')}>
                               <Text style={[tailwind('mb-2  text-3xl'), {
                                   lineHeight: 0
                               }]}>
                                   {route.params.listing.name}
                               </Text>
                               <View style={tailwind('flex flex-row items-center')}>
                                   <NumberFormat
                                       prefix='₦'
                                       value={route.params.listing.price}
                                       thousandSeparator
                                       displayType="text"
                                       renderText={(value) => (
                                           <Text
                                               style={tailwind('text-2xl font-bold text-black')}
                                           >
                                               {value}
                                           </Text>
                                       )}
                                   />
                                   <Text style={tailwind(' ml-2 text-brand-gray-700 text-base')}>
                                       {route.params.listing.serving}
                                   </Text>
                               </View>
                           </View>
                           <View style={tailwind('flex-row  items-center')}>
                               <TouchableOpacity disabled={quantity <= 1} onPress={handleDecrease} style={tailwind('bg-white w-8 h-8  rounded border-1.5 border-black flex items-center justify-center')}>
                                   <Minus color="#000000" size={16}/>
                               </TouchableOpacity>
                               <Text style={tailwind('text-lg font-bold mx-3')}>{quantity}</Text>
                               <TouchableOpacity onPress={handleIncrease} style={tailwind('bg-black w-8 h-8 rounded border-1.5 border-black flex items-center justify-center')}>
                                   <Plus color="#ffffff" size={16} style={tailwind('text-white')} />
                               </TouchableOpacity>
                           </View>
                       </View>
                       <Text style={tailwind('mt-3 text-lg text-brand-gray-700')}>
                           {route.params.listing.desc}
                       </Text>
                   </View>
               </View>
               {loading ? (
                   <View style={tailwind('px-4')}>
                       <SkeletonLoader row={2} screen={SkeletonLoaderScreen.VendorScreen} />
                   </View>
               ) : (
                   <View style={tailwind('flex flex-col')}>
                       {listing?.optionGroups.map((option, index) => (
                           <ListingOptionSection option={option} key={index} onSelectedOptionsChange={onOptionValueChange}  />
                       ))}
                   </View>
               )}
           </ScrollView>
            {!loading && (
                <View style={tailwind('px-4 py-2 bg-white pb-10')}>
                    {hasItemsInCart && cart?.length && cartvendor === listing?.vendor._id ? (
                        <GenericButton onPress={() => goToBasket() } label={`View basket (${cart?.length})`} labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-black')} testId="" />
                    ) : (
                        <GenericButton onPress={() => addToBasket()} label={`Add ${_cart.quantity} to basket ~ ₦${_cart.totalValue.toLocaleString()}`} labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-black')} testId="" />
                    )}
                </View>
            )}
        </View>
    )
}
