import {StackScreenProps} from "@react-navigation/stack";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {  ListRenderItemInfo, ScrollView, Text, View} from "react-native";
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
} from "@screens/AppNavigator/Screens/home/components/CategorySection";
import {FlashList} from "@shopify/flash-list";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {readCartFromStorage} from "@store/cart.reducer";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {AppScreenName, ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {IconButton} from "@components/commons/buttons/IconButton";
import {fetchSubscriptions} from "@store/vendors.reducer";
import FastImage from "react-native-fast-image";
import moment from 'moment';
import {NumericFormat as NumberFormat} from "react-number-format";
import {useAnalytics} from "@segment/analytics-react-native";
import {isRestaurantOpen} from "../../../../../utils/DateFormatter";

type VendorModalScreenProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_VENDOR_SCREEN>

 export const VendorModal: React.FC<VendorModalScreenProps> = ({navigation, route}) => {
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setReviews] = useState<VendorReviewOverview | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [categories, setCategories] = useState<ListingCategoryI[]>([])
    const [scheduled, setScheduled] = useState<ScheduledListingI[]>([])
    const toast = useToast()
     const dispatch = useAppDispatch()
    const analytics = useAnalytics()


    const {cart} = useAppSelector((state: RootState) => state.cart)

    const {subscriptions} = useAppSelector((state: RootState) => state.vendors)
    const {profile} = useAppSelector((state: RootState) => state.profile)
    const [subscribing, setSubscribing] = useState<boolean>(false)
     const filteredCategories = useMemo(() => {
         if (categories.length) {
             return categories.filter(ct => ct.listingsMenu.length >= 1)
         }
     }, [categories])

     const vendorHasSubscription = useMemo(() => {
         if (!subscriptions) {
return
}
         const vendorSub = subscriptions.find(sb => sb.vendor === route.params.vendor?._id)

         const userIsSubscribed = vendorSub?.subscribers.some((sb: any) => sb === profile?._id)

         return {
             userIsSubscribed,
             vendorHasEnabledSub: Boolean(vendorSub?.enabledByVendor)
         }
     }, [subscriptions?.length])



     useEffect(() => {
         void analytics.screen(ModalScreenName.MODAL_VENDOR_SCREEN)
     }, [])

     const handleSubscriptions = async () => {
        const subStatus = vendorHasSubscription?.userIsSubscribed
       try {
           setSubscribing(true)
           await _api.requestData({
               method: 'POST',
               url: 'vendor/subscribe',
               data: {
                   "vendor": route.params.vendor._id,
                   "subscriberId": profile._id
               }
           })
           dispatch(fetchSubscriptions(profile._id))
           showTost(toast, subStatus ? 'You have unsubscribed from vendor' : 'You have subscribed to vendor', 'success')
       } catch (error) {
           showTost(toast, 'Failed to subscribe to vendor', "error")
       } finally {
           setSubscribing(false)
       }
     }

    useEffect(() => {
        async function fetchData () {
            try {
                const fetchReviews = _api.requestData<null, VendorReviewOverview >({
                    method: 'GET',
                    url: `review/stats/vendor-reviews/${route.params?.vendor?._id}`
                })

                const fetchCategories = _api.requestData<null, ListingCategoryI[]>({
                    method: 'GET',
                    url: `listing/categories/${route.params?.vendor?._id}`,

                })

                const fetchScheduled = _api.requestData<null, ScheduledListingI[]>({
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
                headerTitleAlign: 'left',
                headerTitleStyle: tailwind('text-xl'),
                headerLeft: () => <ModalCloseIcon onPress={() => navigation.navigate(HomeScreenName.HOME)} />,
            })
        }, [])

     const restaurantOperationStatus = useMemo(() => {
         return isRestaurantOpen(route.params.vendor.settings?.startTime ?? '', route.params.vendor.settings?.cutoffTime ?? '')
     }, [route.params.vendor])

     const warnClosed = () => {
         showTost(toast, `${route.params.vendor.businessName} is closed now. opens everyday at ${moment(route.params.vendor.settings?.startTime).format('HH:mm')}`, 'warning')
     }

     const onPress = (listing: ListingMenuI) => {
         navigation.navigate(
             ModalScreenName.MODAL_LISTING_SCREEN,
             {
                 listing,
                 vendor: route.params.vendor,
                 availableDate: scheduled.find(sc => sc.listing._id === listing._id)?.availableDate,
                 isScheduled: scheduled.some((sc) => sc.listing._id === listing._id)
             }
         )
     }

     const renderItem = useCallback(({item}:  ListRenderItemInfo<ListingCategoryI>) => {
         return <VendorCategorySection
             warningCallback={warnClosed}
             vendorOperationStatus={restaurantOperationStatus}
             onPress={onPress} category={item}
         />
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
                return 'instant and pre-orders'
            break;

            default:
                return 'all orders'
        }
     }



    return (
        <View style={tailwind('flex-1 bg-white relative')}>
            <ScrollView style={tailwind('pb-20')}>
                <View style={tailwind('flex flex-col w-full')}>
                    <View style={tailwind('relative')}>
                        <FastImage  resizeMode={FastImage.resizeMode.cover} source={{ uri: route.params?.vendor?.businessImage, priority:FastImage.priority.high }} style={[tailwind("w-full"), { height: 170 }]} />
                        <View style={tailwind('absolute bottom-2  left-2 flex flex-row items-center')}>
                            {route.params.vendor.settings.deliveryType !== 'PRE_ORDER' && (
                                <View style={tailwind('rounded-xl py-1.5 ', {'bg-primary-500 px-4': restaurantOperationStatus, 'bg-gray-100 px-2': !restaurantOperationStatus})}>
                                    <Text style={tailwind('text-center text-white', {'text-black': !restaurantOperationStatus } )}>{restaurantOperationStatus ? 'Open' : `Closed`}</Text>
                                </View>
                            )}
                            <View style={tailwind('rounded-xl py-1.5 bg-gray-100 ml-2 px-4')}>
                                <View style={tailwind('flex flex-row items-center')}>
                                    <Text style={tailwind('text-black')}>Min order:</Text>
                                    <NumberFormat
                                        prefix="₦"
                                        value={route.params.vendor.settings.minOrder}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text style={tailwind("text-center text-primary-500")}>{value}</Text>
                                        )}
                                    />
                                </View>
                            </View>
                        </View>
                    </View>
                    <View style={tailwind('px-4 flex flex-col mt-6')}>
                        <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                            <Text style={tailwind('w-2/3 p-0 m-0 mb-2 font-bold text-3xl')}>
                                {route.params?.vendor?.businessName}
                            </Text>
                                <View style={tailwind('flex flex-row')}>
                                    {vendorHasSubscription?.userIsSubscribed ? (
                                        <IconButton onPress={handleSubscriptions} disabled={subscribing} iconName="notifications-sharp" iconStyle={tailwind('text-primary-500')} iconType="Ionicons" iconSize={32} />
                                    ) : (
                                        <IconButton onPress={handleSubscriptions} disabled={subscribing} iconName="notifications-outline"  iconType="Ionicons" iconSize={32} />
                                    )}
                                </View>
                        </View>
                        {loading ? (
                            <>
                                <SkeletonLoader row={1} screen={SkeletonLoaderScreen.VendorDistanceLoader} />
                                <View style={tailwind('')}>
                                    <SkeletonLoader row={2} screen={SkeletonLoaderScreen.VendorScreen} />
                                </View>
                            </>
                        ) : (
                            <View style={tailwind('flex-1 h-full')}>
                                    <View style={tailwind('flex flex-row items-center')}>
                                        <IconComponent iconType="AntDesign" name="star" size={14} style={tailwind('text-yellow-300')}/>
                                        <IconComponent iconType="AntDesign" name="star" size={14} style={tailwind('text-yellow-300')}/>
                                        <Text  style={tailwind('text-brand-gray-700 text-sm ml-1')}>100 Reviews</Text>
                                    </View>
                                <View style={tailwind('flex flex-row items-center w-full')}>
                                    <View style={tailwind('flex flex-row items-center mt-1')}>
                                        <Text style={tailwind('text-brand-gray-700 text-sm')}>Delivery in {route.params.delivery?.duration ?? '20'} Minutes</Text>
                                    </View>
                                    <View style={tailwind('flex flex-row items-center mt-1 border-l-1.5 ml-5 px-2 border-brand-gray-700')}>
                                        <Text style={tailwind('text-brand-gray-700 text-sm')}>Accepts {getVendorDelivery()}</Text>
                                    </View>
                                </View>
                                <View style={tailwind('flex flex-col w-full')}>
                                    <View style={tailwind('flex flex-row mt-1  items-center')}>
                                        <IconComponent iconType="AntDesign" name="clockcircleo" style={tailwind('text-brand-gray-700')} />
                                        <Text  style={tailwind('text-brand-gray-700 text-sm ml-1')}>Opens</Text>
                                        <Text style={tailwind('text-brand-gray-700 text-sm ml-2')}>{moment(route.params.vendor.settings?.startTime).format('HH:mm')}</Text>
                                    </View>
                                    <View style={tailwind('flex flex-row mt-1 items-center')}>
                                        <IconComponent iconType="AntDesign" name="clockcircleo" style={tailwind('text-brand-gray-700')} />
                                        <Text  style={tailwind('text-brand-gray-700 text-sm ml-1')}>Closes</Text>
                                        <Text style={tailwind('text-brand-gray-700 text-sm ml-2')}>{moment(route.params.vendor.settings?.cutoffTime).format('HH:mm')}</Text>
                                    </View>
                                </View>
                                {scheduled.length > 0 && (
                                    <ScheduledMenuSection onPress={onPress} menu={scheduled} />
                                )}
                                <View style={tailwind('h-full')}>
                                    <FlashList
                                        contentContainerStyle={tailwind('py-4 pb-16')}
                                        data={filteredCategories}
                                        renderItem={renderItem as any}
                                        keyExtractor={(item) => item._id}
                                        estimatedItemSize={Number(filteredCategories?.length ?? 1) * 4}
                                        showsVerticalScrollIndicator={false}
                                    />
                                </View>
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

