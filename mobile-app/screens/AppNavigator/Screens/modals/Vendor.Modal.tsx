import {StackScreenProps} from "@react-navigation/stack";
import React, {useCallback, useEffect, useMemo, useState} from "react";
import {ListRenderItemInfo, ScrollView, Text, View} from "react-native";
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
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {AppScreenName, ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import FastImage from "react-native-fast-image";
import moment from 'moment';
import {useAnalytics} from "@segment/analytics-react-native";
import {isRestaurantOpen} from "../../../../../utils/DateFormatter";
import { AlarmClockCheck, AlarmClockOff} from 'lucide-react-native'
import {useCart} from "@contexts/cart.provider";
import {useProfile} from "@contexts/profile.provider";
import {CustomerIO} from "customerio-reactnative";
type VendorModalScreenProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_VENDOR_SCREEN>

 export const VendorModal: React.FC<VendorModalScreenProps> = ({navigation, route}) => {
     // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const [_, setReviews] = useState<VendorReviewOverview | undefined>()
    const [loading, setLoading] = useState<boolean>(true)
    const [categories, setCategories] = useState<ListingCategoryI[]>([])
    const [scheduled, setScheduled] = useState<ScheduledListingI[]>([])
    const toast = useToast()
     const {readCart} = useCart()
    const analytics = useAnalytics()


    const {cart} = useCart()

    const {profile} = useProfile()
    const [subscribing, setSubscribing] = useState<boolean>(false)
     const filteredCategories = useMemo(() => {
         if (categories.length) {
             return categories.filter(ct => ct.listingsMenu.length >= 1)
         }
     }, [categories])




     useEffect(() => {
         void analytics.screen(ModalScreenName.MODAL_VENDOR_SCREEN)
         void CustomerIO.screen(ModalScreenName.MODAL_VENDOR_SCREEN, {
             vendor: route.params.vendor._id
         })
     }, [])


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
            void readCart()
        }

    }, [route.params?.vendor?._id])

        useEffect(() => {
            navigation.setOptions({
                headerShown: false,
            })
        }, [])


     const restaurantOperationStatus = useMemo(() => {
         return isRestaurantOpen(route.params.vendor.settings?.operations?.startTime ?? '', route.params.vendor.settings?.operations?.cutoffTime ?? '')
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
             } as any
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
         navigation.navigate(AppScreenName.BASKET, {
             screen: BasketScreenName.SINGLE_BASKET
         } as any)
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
                        <FastImage  resizeMode={FastImage.resizeMode.cover} source={{ uri: route.params?.vendor?.businessImage, priority:FastImage.priority.high }} style={[tailwind("w-full"), { height: 250 }]} />
                        <ModalCloseIcon size={24} iconStyle={tailwind('mx-0 m-1.5')} buttonStyle={tailwind('left-2 absolute top-10 bg-gray-200 rounded-full')} onPress={() => navigation.goBack()} />
                        <View style={tailwind('absolute bottom-2  left-2 flex flex-row items-center')}>
                            {route.params.vendor.settings.deliveryType !== 'PRE_ORDER' && (
                                <View style={tailwind('rounded-xl py-1.5 ', {'bg-primary-100 px-4': restaurantOperationStatus, 'bg-gray-100 px-2': !restaurantOperationStatus})}>
                                    <Text style={tailwind('text-center text-sm text-white', {'text-black': !restaurantOperationStatus } )}>{restaurantOperationStatus ? 'Open' : `Closed`}</Text>
                                </View>
                            )}
                        </View>
                    </View>
                    <View style={tailwind('px-4 flex flex-col mt-3')}>
                        <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                            <Text style={tailwind('w-2/3 p-0 m-0 mb-2 text-slate-900 font-bold text-2xl')}>
                                {route.params?.vendor?.businessName}
                            </Text>
                                {/* <View style={tailwind('flex flex-row')}> */}
                                {/*     {vendorHasSubscription?.userIsSubscribed ? ( */}
                                {/*         <BellDotIcon onPress={handleSubscriptions} size={20} disabled={subscribing} style={tailwind('text-primary-100')} /> */}
                                {/*     ) : ( */}
                                {/*         <BellRing onPress={handleSubscriptions} size={20} style={tailwind('text-black')} /> */}
                                {/*     )} */}
                                {/* </View> */}
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
                                        <Text  style={tailwind('text-slate-900 font-light text-sm ml-1')}>100 Reviews</Text>
                                    </View>
                                <View style={tailwind('flex flex-row items-center w-full')}>
                                    <View style={tailwind('flex flex-row items-center mt-1')}>
                                        <Text style={tailwind('text-slate-900 font-normal text-sm')}>Delivery in {route.params.delivery?.duration ?? '20'} Minutes</Text>
                                    </View>
                                    <View style={tailwind('flex flex-row items-center mt-1 border-l-1.5 ml-5 px-2 border-brand-gray-700')}>
                                        <Text style={tailwind('text-slate-900 font-normal text-sm')}>Accepts {getVendorDelivery()}</Text>
                                    </View>
                                </View>
                                <View style={tailwind('flex pb-3 flex-row items-center w-full border-b-0.5 border-gray-200')}>
                                    <View style={tailwind('flex flex-row mt-1  items-center mr-3')}>
                                        <AlarmClockCheck size={16} style={tailwind('text-slate-900')} />
                                        <Text  style={tailwind('text-slate-900 font-normal text-sm ml-1')}>Opens</Text>
                                        <Text style={tailwind('text-slate-900 font-normal text-sm ml-2')}>{moment(route.params.vendor.settings?.operations?.startTime).format('HH:mm')}</Text>
                                    </View>
                                    <View style={tailwind('flex flex-row mt-1 items-center')}>
                                        <AlarmClockOff size={16} style={tailwind('text-slate-900 font-normal')} />
                                        <Text  style={tailwind('text-slate-900 font-normal text-sm ml-1')}>Closes</Text>
                                        <Text style={tailwind('text-slate-900 font-normal text-sm ml-2')}>{moment(route.params.vendor.settings?.operations?.cutoffTime).format('HH:mm')}</Text>
                                    </View>
                                </View>
                                {scheduled.length > 0 && (
                                    <ScheduledMenuSection onPress={onPress} menu={scheduled} />
                                )}
                                <View style={tailwind('h-full')}>
                                    <FlashList
                                        contentContainerStyle={tailwind('py-4 pb-16')}
                                        data={filteredCategories as any}
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
            {cart.hasItemsInCart && (
                <View style={tailwind('px-4 mb-7')}>
                    <GenericButton onPress={() => goToBasket() } label={`Proceed to order ${cart?.cart?.length} item`} labelColor={tailwind('text-white  py-2 ')} backgroundColor={tailwind('bg-primary-100 py-3')} testId="" />
                </View>
            )}
        </View>
    )
}

