import React, {useEffect, useState} from "react";
import {ListingMenuI, ListingOption, ListingOptionGroupI} from "@nanahq/sticky";
import {useToast} from "react-native-toast-notifications";
import {_api} from "@api/_request";
import {showTost} from "@components/commons/Toast";
import { Image, ScrollView, Text, TouchableOpacity, View} from "react-native";
import {StackScreenProps} from "@react-navigation/stack";
import {tailwind} from "@tailwind";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {ShareListingIcon} from "@screens/AppNavigator/Screens/modals/components/ShareListingIcon";
import {NumericFormat as NumberFormat} from "react-number-format";
import {ListingOptionSection} from "@screens/AppNavigator/Screens/modals/components/ListingOptionSection";
import {SkeletonLoader, SkeletonLoaderScreen} from "@components/commons/SkeletonLoaders/SkeletonLoader";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {IconComponent} from "@components/commons/IconComponent";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import { saveCartToStorage} from "@store/cart.reducer";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import { ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {calculateTotalValue} from "../../../../../utils/CalculateCartTotal";

type ListingModalScreenProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_LISTING_SCREEN>

export interface Cart {
    totalValue: number | string
    cartItem: ListingMenuI
    options: ListingOption[]

    quantity: number
}

export const ListingModal: React.FC<ListingModalScreenProps>  = ({navigation, route}) => {
    const {cart, hasItemsInCart, vendor: cartvendor} = useAppSelector((state: RootState) => state.cart)

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



    const handleIncrease = () => {
        setQuantity(quantity + 1);
        setCart((prevCart) => ({
            ...prevCart,
            quantity: quantity + 1,
            totalValue: calculateTotalValue(quantity + 1, +route.params.listing.price, _cart.options),
        }));
    };

    const handleDecrease = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
            setCart((prevCart) => ({
                ...prevCart,
                quantity: quantity - 1,
                totalValue: calculateTotalValue(quantity - 1, +route.params.listing.price, _cart.options),
            }));
        }
    };

    const onOptionValueChange = (_selectedOptions: ListingOption[]) => {
        setSelectedOptions(_selectedOptions);
        setCart((prevCart) => ({
            ...prevCart,
            options: _selectedOptions,
            totalValue: calculateTotalValue(prevCart.quantity, +route.params.listing.price, _selectedOptions),
        }));
    };

    useEffect(() => {
        async function fetchData () {
            try {
                const {data: _listing} = await _api.requestData({
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
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            headerRight: () => <ShareListingIcon  onPress={() => {}}/>,
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.navigate(ModalScreenName.MODAL_VENDOR_SCREEN, {} as any)} />,
        })
    }, [])


    useEffect(() => {
        if (listing !== undefined && listing._id ) {
            const requiredOptions: ListingOptionGroupI[] = []

            for (const optionGroup of listing.optionGroups) {
                if (optionGroup.min) {
                    requiredOptions.push(optionGroup)
                }
                setRequiredOption(Boolean(optionGroup.min))

            }



            const options = requiredOptions.flatMap((group) => {
                return group.options.map( op => op)
            })

            const allRequiredOptionsSelected = options.some(({name}) =>
                selectedOptions.some((option) => option.name === name)
            );

            setRequiredOptions(allRequiredOptionsSelected)

        }
    }, [listing, selectedOptions])

    const addToBasket  = () => {
        if ( hasRequiredOption && !haveSelectedAllRequiredOptions) {
            showTost(toast, 'Please select required options', 'warning')
            return
        }
        dispatch(saveCartToStorage({
            vendor: listing?.vendor  as any,
            cart: _cart
        }))
        navigation.navigate(ModalScreenName.MODAL_VENDOR_SCREEN, {} as any)
    }

    const goToBasket = () => {
        setTimeout(() => {
            navigation.navigate(BasketScreenName.BASKET)
        }, 1000)
    }
    return (
        <View style={[tailwind('flex-1  relative'), {backgroundColor: 'rgba(230, 230, 230, 0.4)'}]}>
           <ScrollView style={tailwind('pb-10')}>
               <View style={tailwind('pb-5 mb-3 bg-white')}>
                   <Image source={{ uri: route.params.listing.photo, cache: "force-cache" }} style={[tailwind("w-full"), { height: 170 }]} />
                   <View style={tailwind('px-4 flex flex-col mt-6')}>
                       <Text style={[tailwind(' p-0 m-0 mb-2 font-bold text-3xl'), {
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
                                      style={tailwind('text-2xl text-brand-black-500')}
                                  >
                                      {value}
                                  </Text>
                              )}
                          />
                          <Text style={[tailwind(' ml-2 text-brand-gray-700 text-base'), {
                              lineHeight: 0
                          }]}>
                              {route.params.listing.serving}
                          </Text>
                      </View>
                       <Text style={[tailwind(' p-0 m-0  text-lg text-brand-gray-700'), {
                           lineHeight: 0
                       }]}>
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
                       <View style={tailwind('flex-1 bg-white px-4 py-10')}>
                           <View style={tailwind('flex-row  items-center')}>
                               <TouchableOpacity disabled={quantity <= 1} onPress={handleDecrease} style={tailwind('bg-brand-ash w-12 h-12  rounded-full  flex items-center justify-center')}>
                                   <IconComponent iconType="AntDesign" name="minus"  size={20}/>
                               </TouchableOpacity>
                                   <Text style={tailwind('text-lg mx-3')}>{quantity}</Text>
                               <TouchableOpacity onPress={handleIncrease} style={tailwind('bg-brand-ash w-12 h-12  rounded-full  flex items-center justify-center')}>
                                   <IconComponent iconType="AntDesign" name="plus" size={20} />
                               </TouchableOpacity>
                           </View>
                       </View>
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
