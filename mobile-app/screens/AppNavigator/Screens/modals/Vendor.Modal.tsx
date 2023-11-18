import {StackScreenProps} from "@react-navigation/stack";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import { Image, ListRenderItemInfo, ScrollView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {ListingCategoryI, ListingMenuI, ScheduledListingI, VendorReviewOverview} from "@nanahq/sticky";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import {SkeletonLoader, SkeletonLoaderScreen} from "@components/commons/SkeletonLoaders/SkeletonLoader";
import {IconComponent} from "@components/commons/IconComponent";
import {
    ScheduledMenuSection,
    VendorCategorySection
} from "@screens/AppNavigator/Screens/modals/components/CategorySection";
import {FlashList} from "@shopify/flash-list";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {readCartFromStorage} from "@store/cart.reducer";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {AppScreenName, ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";

type VendorModalScreenProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_VENDOR_SCREEN>

 export const VendorModal: React.FC<VendorModalScreenProps> = ({navigation, route}) => {
    const [reviews, setReviews] = useState<VendorReviewOverview | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [categories, setCategories] = useState<ListingCategoryI[]>([])
    const [scheduled, setScheduled] = useState<ScheduledListingI[]>([])
    const toast = useToast()
     const dispatch = useAppDispatch()

    const {cart} = useAppSelector((state: RootState) => state.cart)

     const filteredCategories = useMemo(() => {
         if(categories.length) {
             return categories.filter(ct => ct.listingsMenu.length >= 1)
         }
     }, [categories])
    useEffect(() => {

        async function fetchData () {
            try {
                const fetchReviews = _api.requestData({
                    method: 'GET',
                    url: `review/stats/vendor-reviews/${route.params?.vendor?._id}`
                })

                const fetchCategories = _api.requestData({
                    method: 'GET',
                    url: `listing/categories/${route.params?.vendor?._id}`,

                })

                const fetchScheduled = _api.requestData({
                    method: 'GET',
                    url: `listing/scheduled/${route.params?.vendor?._id}`,

                })

                const [{data : _categories}, {data : _scheduled}, {data : _reviews}] = await Promise.all([fetchCategories, fetchScheduled, fetchReviews])
                setReviews(_reviews)
                setCategories(_categories)
                setScheduled(_scheduled)

            } catch (error) {
                showTost(toast, 'Something went wrong fetching vendor', 'success')
            } finally {
                setLoading(false)
            }
        }

        if (loading) {
            void fetchData()
            dispatch(readCartFromStorage())
        }

    }, [route.params?.vendor?._id])

        useEffect(() => {
            navigation.setOptions({
                headerShown: true,
                headerTitle: route?.params?.vendor?.businessName,
                headerBackTitleVisible: false,
                headerTitleAlign: 'center',
                headerTitleStyle: tailwind('text-xl'),
                headerLeft: () => <ModalCloseIcon onPress={() => navigation.navigate(HomeScreenName.HOME)} />,
            })
        }, [])

     const onPress = (listing: ListingMenuI) => navigation.navigate(ModalScreenName.MODAL_LISTING_SCREEN,{listing, isScheduled: scheduled.some((sc) => sc.listing._id === listing._id) } )

     const renderItem = useCallback(({item}:  ListRenderItemInfo<ListingCategoryI>) => {
         return <VendorCategorySection onPress={onPress} category={item}/>
     }, [])

     const goToBasket = () => {
         setTimeout(() => {
             navigation.navigate(AppScreenName.BASKET, {
                 screen: BasketScreenName.BASKET
             })
         }, 1000)
     }

     const getVendorDelivery = (): string => {
        switch (route.params.vendor?.settings?.deliveryType) {
            case 'PRE_ORDER':
                return 'only pre-orders'
            break;

            case 'ON_DEMAND':
                return 'only instant orders'
            break;

            case 'PRE_AND_INSTANT':
                return 'accepts instant and pre-orders'
            break;

            default:
                return 'all orders'
        }
     }

    return (
        <View style={tailwind('flex-1 bg-white relative')}>
            <ScrollView style={tailwind('')}>
                <View style={tailwind('flex flex-col w-full')}>
                    <Image source={{ uri: route.params?.vendor?.businessImage, cache: "force-cache" }} style={[tailwind("w-full"), { height: 170 }]} />
                    <View style={tailwind('px-4 flex flex-col mt-6')}>
                        <Text style={[tailwind('w-2/3 p-0 m-0 mb-2 font-bold text-4xl'), {
                            lineHeight: 0
                        }]}>
                            {route.params?.vendor?.businessName}
                        </Text>
                        {loading ? (
                            <>
                                <SkeletonLoader row={1} screen={SkeletonLoaderScreen.VendorDistanceLoader} />
                                <View style={tailwind('')}>
                                    <SkeletonLoader row={2} screen={SkeletonLoaderScreen.VendorScreen} />
                                </View>
                            </>
                        ) : (
                            <View style={tailwind('flex-1')}>
                                    <View style={tailwind('flex flex-row items-center')}>
                                        <IconComponent iconType="Feather" name="star" size={14} style={tailwind('text-black')}/>
                                        <Text style={tailwind('text-brand-black-500')}>{reviews?.rating} ({reviews?.numberOfReviews} ratings and reviews)</Text>
                                    </View>
                                <View style={tailwind('flex flex-row items-center mt-1')}>
                                    <Text style={tailwind('text-brand-gray-700 text-sm')}>Delivery in 15 Min</Text>
                                </View>
                                <View style={tailwind('flex flex-row items-center mt-1')}>
                                    <Text style={tailwind('text-brand-gray-700 text-sm')}>Accepts {getVendorDelivery()}</Text>
                                </View>
                                {scheduled.length > 0 && (
                                    <ScheduledMenuSection onPress={onPress} menu={scheduled} />
                                )}
                                <FlashList
                                    contentContainerStyle={tailwind('py-4')}
                                    data={filteredCategories}
                                    renderItem={renderItem as any}
                                    keyExtractor={(item) => item._id}
                                    estimatedItemSize={Number(filteredCategories?.length ?? 1) * 4}
                                    showsVerticalScrollIndicator={false}
                                />
                            </View>
                        )}
                    </View>
                </View>
            </ScrollView>
            {cart !== undefined && (
                <View style={tailwind('px-4 mb-7')}>
                    <GenericButton onPress={() => goToBasket() } label={`View basket (${cart?.length})`} labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-black')} testId="" />
                </View>
            )}
        </View>
    )
}

