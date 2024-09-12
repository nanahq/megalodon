import React, {useEffect, useRef, useState} from "react";
import {ListingMenuI, ListingOption, ListingOptionGroupI} from "@nanahq/sticky";
import {useToast} from "react-native-toast-notifications";
import {_api} from "@api/_request";
import {showTost} from "@components/commons/Toast";
import {
    Animated,
    NativeScrollEvent,
    NativeSyntheticEvent,
    ScrollView,
    Text,
    TouchableOpacity,
    View
} from "react-native";
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

import {Minus, Plus} from "lucide-react-native";
import {calculateTotalValue} from "../../../../../utils/CalculateCartTotal";

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
            vendor: route.params.vendor  as any,
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


    const fadeAnim = useRef(new Animated.Value(1)).current; // Animated value for fade
    const [headerVisible, setHeaderVisible] = useState(true); // Header visibility state

    // Smoothly fade in the header
    const fadeIn = () => {
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 800,
            useNativeDriver: true,
        }).start(() => {
            setHeaderVisible(true)
            navigation.setOptions({
                headerShown: true,
                headerTitle: route.params.vendor.businessName,
                headerBackTitleVisible: false,
                headerTitleAlign: 'left',
                headerTitleStyle: tailwind('text-xl'),
                headerLeft: () => (
                    <ModalCloseIcon size={24} onPress={() => navigation.goBack()} />
                ),
            });
        });
    };

    const fadeOut = () => {
        Animated.timing(fadeAnim, {
            toValue: 0,
            duration: 800,
            useNativeDriver: true,
        }).start(() => {
            setHeaderVisible(false)
            navigation.setOptions({
                headerShown: false
            })
        });
    };

    const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
        const scrollOffsetY = event.nativeEvent.contentOffset.y;

        if (scrollOffsetY > 20) {
            if (!headerVisible) {
                fadeIn();
            }
        } else {
            if (headerVisible) {
                fadeOut();

            }
        }
    };

    console.log(route.params.listing)
    return (
        <View style={tailwind('flex-1 relative bg-white')}>
           <ScrollView style={tailwind('pb-10')}>
               <View style={tailwind('pb-5 mb-3 bg-white')}>
                   <FastImage resizeMode={FastImage.resizeMode.cover} source={{ uri: route.params.listing.photo, priority: FastImage.priority.normal }} style={[tailwind("w-full"), { height: 250 }]} />
                   <ModalCloseIcon size={24} iconStyle={tailwind('mx-0 m-1.5')} buttonStyle={tailwind('left-2 absolute top-10 bg-gray-200 rounded-full')} onPress={() => navigation.goBack()} />
                   <View style={tailwind('px-4 flex flex-col mt-2')}>
                       <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                           <View style={tailwind('flex flex-col w-3/4')}>
                               <Text style={[tailwind('mb-2 font-bold text-2xl text-darkblue-50')]}>
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
                                               style={tailwind('font-bold text-lg text-primary-100')}
                                           >
                                               {value}
                                           </Text>
                                       )}
                                   />
                                   <Text style={tailwind(' ml-2 text-gray-600 ')}>
                                       {route.params.listing.serving}
                                   </Text>
                               </View>
                           </View>
                           <View style={tailwind('flex-row bg-primary-50 py-2.5 px-2 items-center rounded-xl')}>
                               <TouchableOpacity disabled={quantity <= 1} onPress={handleDecrease} style={tailwind('bg-white w-6 h-6  rounded-full  flex items-center justify-center')}>
                                   <Minus color="#469ADC" size={12}/>
                               </TouchableOpacity>
                               <Text style={tailwind('text-primary-100 mx-3')}>{quantity}</Text>
                               <TouchableOpacity onPress={handleIncrease} style={tailwind('bg-white w-6 h-6 rounded-full flex items-center justify-center')}>
                                   <Plus color="#469ADC" size={12}/>
                               </TouchableOpacity>
                           </View>
                       </View>
                       <Text style={tailwind('mt-3 text-darkblue-50')}>
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
                <View style={tailwind('px-4 py-2 border-t-0.5 border-gray-300 bg-white py-6')}>
                    {hasItemsInCart && cart?.length && cartvendor === listing?.vendor._id ? (
                        <GenericButton onPress={() => goToBasket() } label={`View basket (${cart?.length})`} labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-100')} testId="" />
                    ) : (
                        <GenericButton onPress={() => addToBasket()} label={`Add ${_cart.quantity} to basket ~ ₦${_cart.totalValue.toLocaleString()}`} labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-100')} testId="" />
                    )}
                </View>
            )}
        </View>
    )
}
