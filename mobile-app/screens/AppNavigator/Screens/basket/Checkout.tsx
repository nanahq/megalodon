import {ScrollView, Text, View} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {BasketParamsList} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import { tailwind} from "@tailwind";
import {BasketScreenName} from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import {CheckoutButton} from "@screens/AppNavigator/Screens/basket/components/CheckoutButton";
import {
    AppConstants,
    DeliveryFeeResult,
    OrderBreakDown, OrderI,
    OrderTypes,
    VendorOperationType,
} from "@nanahq/sticky";
import {CheckoutBreakDown} from "@screens/AppNavigator/Screens/basket/components/CheckoutBreakDown";
import {DeliveryAddressBox} from "@screens/AppNavigator/Screens/basket/components/address/DeliveryAddressBox";
import {AddressBookModal} from "@screens/AppNavigator/Screens/basket/components/address/AddressModal";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {ScheduleDeliveryModal} from "@screens/AppNavigator/Screens/basket/components/schedule/ScheduleModal";
import {ScheduleDeliveryBox} from "@screens/AppNavigator/Screens/basket/components/schedule/ScheduleDeliveryBox";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import moment from "moment";
import {
    PaymentMethodBox,
    PaymentMethodI
} from "@screens/AppNavigator/Screens/basket/components/payment/PaymentMethodBox";
import {LoaderComponent} from "@components/commons/LoaderComponent";
import {PaymentMethodModal} from "@screens/AppNavigator/Screens/basket/components/payment/PaymentModal";
import {useAnalytics} from "@segment/analytics-react-native";
import {usePromoCode} from "@contexts/PromoCode";
import {PromocodeBox} from "@screens/AppNavigator/Screens/basket/components/payment/PromocodeBox";
import {parseSelectedScheduledDateTime} from "../../../../../utils/DateFormatter";
import {SlideToOrderButton, SlideToOrderRef} from "@components/commons/buttons/SliderButton";
import {useLoading} from "@contexts/loading.provider";
import {useCart} from "@contexts/cart.provider";
import {mutate} from "swr";
import {useProfile} from "@contexts/profile.provider";
import {AdditionalInfoModal} from "@screens/AppNavigator/Screens/basket/components/AdditionalInforModal";
import {useAddress} from "@contexts/address-book.provider";
import {AddressMapPreview} from "@screens/AppNavigator/Screens/basket/components/address-map-view";

export const ADDRESS_MODAL = 'ADDRESS_MODAL'

export const ADDITIONAL_INFO_MODAL_SERVICE_FEE = 'ADDITIONAL_INFO_MODAL_SERVICE_FEE'
export const SCHEDULE_MODAL = 'SCHEDULE_MODAL'

export const PAYMENT_METHOD_MODAL = 'PAYMENT_METHOD_MODAL'
export const Checkout: React.FC = () => {
    const [view, setView] = useState<VendorOperationType>("ON_DEMAND")
    const slideToOrderRef = useRef<SlideToOrderRef | null>(null);
    const [vendor, setVendor] = useState<any | undefined>(undefined)
    const [selectedAddress, setSelectedAddress] = useState<any | undefined>(undefined)
    const [isThirdParty] = useState<boolean>(false)
    const {setLoadingState} = useLoading()
    const [deliveryTime, setDeliveryItem] = useState<{time: string, date: string} | undefined>(undefined)
    const [fetchingConstant, setFetchingConstants] = useState<boolean>(true)
    const [deliveryEta, setDeliveryEta] = useState<DeliveryFeeResult | undefined>(undefined)
    const [_, setPlacingOrder] = useState<boolean>(false)

    const [confirmOrder, setConfirmOrder] = useState(false)

    const [orderBreakDown, setOrderBreakdown] = useState<OrderBreakDown>({
        deliveryFee: 0,
        vat: 0,
        orderCost: 0,
        systemFee: 0
    })

    const [discount, setDiscount] = useState<number | undefined>(undefined)
    const [paymentMethod, setPaymentMethod] = useState<PaymentMethodI | undefined>(undefined)
    const [fetchingDeliveryFee, setFetchingDeliveryFee] = useState<boolean>(false)
    const {updateCoupon} = usePromoCode()
    // App store
    const {cart, deleteCart} = useCart()
    const {profile} = useProfile()
    const {addressBook, addressLabels} = useAddress()
    const navigation = useNavigation<NavigationProp<BasketParamsList>>()
    const modalNavigation = useNavigation<NavigationProp<AppParamList>>()
    const addressModalRef = useRef<any>(null)
    const serviceFeeAdditionalInfoModalRef = useRef<any>(null)
    const paymentModalRef = useRef<any>(null)
    const scheduleModalRef = useRef<any>(null)
    const toast = useToast()
    const analytics = useAnalytics()
    const {coupon, calculateCoupon} = usePromoCode()

    const openModal = useCallback(() => {
        addressModalRef.current.present()
        void analytics.track('CLICK:DELIVERY-ADDRESS-MODAL')
    }, [])


    const openPaymentModal = useCallback(() => {
        paymentModalRef.current.present()
        void analytics.track('CLICK:PAYMENT-ADDRESS-MODAL')

    }, [])

    const openScheduleModal =  useCallback(() => {
        scheduleModalRef.current.present()
        void analytics.track('CLICK:DATA-PICKER-ADDRESS-MODAL')
    }, [])

    useEffect(() => {
        async function fetchDeliveryFee () {
            if (vendor !== undefined) {
                setFetchingDeliveryFee(true)
                try {
                    const response = (await _api.requestData<{userCoords: number[], vendorCoords: number[]}, DeliveryFeeResult>({
                        method: 'POST',
                        url: '/location/delivery-fee',
                        data: {
                            userCoords: selectedAddress?.location?.coordinates ?? [0, 0],
                            vendorCoords: vendor.location?.coordinates ?? [0, 0],
                        }
                    })).data

                    setOrderBreakdown((prevState) => ({
                        ...prevState,
                        deliveryFee: response.fee
                    }))

                    setDeliveryEta((prevState) => ({...prevState, ...response}))
                } catch (error) {
                    showTost(toast, 'failed to fetch delivery fee', 'error')
                } finally {
                    setFetchingDeliveryFee(false)

                }
            }
        }

        void fetchDeliveryFee()
    }, [selectedAddress?._id, profile._id, vendor])


    useEffect(() => {
        async function fetchConstants (): Promise<void> {
            try {
                const response = (await _api.requestData<undefined, AppConstants>({
                    method: 'GET',
                    url: '/general/app-constants'
                })).data
                setOrderBreakdown((prevState) => ({...prevState, vat: 0, systemFee: response.cart.SERVICE_FEE}))
            } catch (error) {
                showTost(toast, 'failed to fetch cart constants', 'error')
            } finally {
                setFetchingConstants(false)
            }
        }
        if (fetchingConstant) {
            void fetchConstants()
        }

        void analytics.screen(BasketScreenName.CHECKOUT)
    }, [])

    useEffect(() => {
        if (cart.cart) {
            const totalCartValue = cart.cart.reduce((total, cartItem) => {
                return total + cartItem.totalValue;
            }, 0);

            const systemFee = (totalCartValue / 100) * 10
            let serviceFeePayable = systemFee

            if (systemFee > 500) {
                serviceFeePayable = 500
            } else if (systemFee < 100) {
                serviceFeePayable = 100
            }  else {
                serviceFeePayable = systemFee
            }

            setOrderBreakdown((prev) => ({...prev, orderCost: totalCartValue, systemFee: serviceFeePayable}))
        }

    }, [cart.cart, fetchingConstant])

    useEffect(() => {
            const v = cart.vendor
            let _view: VendorOperationType = 'ON_DEMAND'

            switch (v?.settings.deliveryType) {
                case 'PRE_AND_INSTANT':
                case 'ON_DEMAND':
                    _view  = 'ON_DEMAND'
                    break;
                case 'PRE_ORDER':
                    _view = 'PRE_ORDER'
                    break;
            }
            setVendor(() => v)
            setView(() =>cart.cartItemAvailableDate ? 'PRE_ORDER' : _view)
    }, [ cart.vendor])

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Delivery Details',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle:tailwind(' text-slate-900 text-2xl font-bold'),
            headerLeft: () => <ModalCloseIcon size={18} onPress={() => navigation.navigate(BasketScreenName.SINGLE_BASKET as any)} />,
        })
    }, [])


    useEffect(() => {
        if (coupon !== undefined) {
            if (coupon.type === 'FREE_SHIPPING') {
                setOrderBreakdown(prev => ({...prev, deliveryFee: 0}))
            } else {
                const cartValueWithCoupon = calculateCoupon(orderBreakDown.orderCost)
                setDiscount(cartValueWithCoupon)
            }
        }
    }, [coupon])

    const check = (): { isBlocked: boolean, type: "ADDRESS"  | "DELIVERY_TIME" | "PAYMENT_METHOD" | "NONE"} => {
        if(!Boolean(selectedAddress?._id)) {
            setConfirmOrder(false)
            showTost(toast, 'Please choose a delivery address', 'error')
            return {
                isBlocked: true,
                type: "ADDRESS"
            }
        }

        if(view === "PRE_ORDER" && deliveryTime === undefined) {
            setConfirmOrder(false)
            showTost(toast, 'Please choose a delivery time', 'error')
            return {
                isBlocked: true,
                type: "DELIVERY_TIME"
            }
        }

        if(paymentMethod === undefined) {
            setConfirmOrder(false)
            showTost(toast, 'Please choose payment method time', 'error')
            return {
                isBlocked: true,
                type: "PAYMENT_METHOD"
            }
        }

        return {isBlocked: false, type: "NONE"}
    }


    useEffect(() => {
        if(confirmOrder) {
            void placeOrder()
        }
    }, [confirmOrder])
    const placeOrder = async () => {
        const {isBlocked} = check()

        if(isBlocked) {
            slideToOrderRef.current?.reset()
            return
        }

        const payload = {
            user: profile._id,
            deliveryAddress: selectedAddress?.address ?? '',
            pickupAddress: vendor?.businessAddress,
            listing: cart.cart?.map(crt => crt.cartItem._id) ?? [],
            isThirdParty: isThirdParty,
            orderType: view === 'ON_DEMAND' ? OrderTypes.INSTANT : OrderTypes.PRE,
            options: cart.cart?.map(crt => {
                const options = crt.options.map((op) => op.name)
                return {
                    listing: crt.cartItem._id,
                    options
                }
            }) ?? [],
            orderBreakDown,
            orderDeliveryScheduledTime: view === 'ON_DEMAND'? moment().add(`${Number(vendor?.settings.preparationTime ?? 0) + Number(deliveryEta?.duration ?? 0)}`, 'minutes') : parseSelectedScheduledDateTime(deliveryTime?.date ?? '', deliveryTime?.time ?? '') as any,
            orderValuePayable: Object.values(orderBreakDown).reduce((a, r) => a + r) - (discount ?? 0),
            preciseLocation: {
                type: 'Point',
                coordinates: selectedAddress?.location?.coordinates
            },
            precisePickupLocation: {
                type: 'Point',
                    coordinates: vendor?.location?.coordinates
            },
            primaryContact: profile?.phone,
            vendor: vendor?._id ?? '',
            totalOrderValue: Object.values({...orderBreakDown}).reduce((a, r) => a + r),
            quantity: cart.cart?.map(crt => {
                return {
                    listing: crt.cartItem._id,
                    quantity: crt.quantity
                }
            }) ?? [],
            coupon: coupon ?? undefined,
            paymentType: paymentMethod?.name ?? 'PAY_ONLINE'
        }
        try {
            setPlacingOrder(true)
            setLoadingState(true)
            const response = (await _api.requestData<any, {data: {order: OrderI, paymentMeta: {authorization_url: string, reference: string}}}>({
                method:'POST',
                url: 'order/create',
                data: payload
            })).data


            navigation.navigate(ModalScreenName.MODAL_PAYMENT_SCREEN as any, {
                order: response.data.order,
                meta: response.data.paymentMeta
            } as any)

            navigation.reset({
                index: 0,
                routes: [{ name: BasketScreenName.BASKET }],
            });

            void analytics.track('CLICK:ORDER-PLACED', {
                order: response.data.order._id,
                vendor: response.data.order.vendor._id,
                orderValue: orderBreakDown.orderCost + orderBreakDown.deliveryFee + orderBreakDown.systemFee - (discount ?? 0)
            })

            await deleteCart()
        }  catch (error) {
            console.error(error)
            showTost(toast, 'Failed to place order. Contact support', 'error')
        } finally {
            slideToOrderRef.current?.reset()
            setLoadingState(false)
            setPlacingOrder(false)
            updateCoupon(undefined)
            void mutate('user/profile')
        }
    }


    return (
        <ScrollView style={tailwind('flex-1 bg-white px-4')}>
            <CheckoutButton vendorType={cart.cartItemAvailableDate ? "PRE_ORDER" : vendor?.settings?.operations?.deliveryType ?? 'ON_DEMAND'} view={view} onButtonClick={setView}  />
            <DeliveryAddressBox onPress={() => openModal() } selectedAddress={selectedAddress} />
            { view === 'ON_DEMAND' && selectedAddress !== undefined && deliveryEta !== undefined && vendor !== undefined && (
                <View style={tailwind('mt-3')}>
                    <View style={tailwind('flex flex-row items-center w-full')}>
                        <Text style={tailwind('font-normal text-slate-500 text-sm')}>Delivery in </Text>
                        {fetchingDeliveryFee ? (
                            <LoaderComponent size="small" />
                        ) : (
                            <Text style={tailwind('text-sm text-slate-500 text-center font-normal')}>{Number(deliveryEta.duration) + Number(vendor.settings?.operations?.preparationTime)}   Minutes</Text>
                        )}
                    </View>
                </View>
            )}

            {selectedAddress !== undefined && (
                <AddressMapPreview
                    longitude={selectedAddress?.location?.coordinates[1]}
                    latitude={selectedAddress?.location?.coordinates[0]}
                    address={selectedAddress?.address}
                />
            )}

            {view === 'PRE_ORDER' && (
                <ScheduleDeliveryBox
                    onPress={openScheduleModal}
                    selectedDate={deliveryTime}
                />
            )}
            <PaymentMethodBox
                onPress={() => openPaymentModal()}
                selectedMethod={paymentMethod}
            />

            <View>
                <PromocodeBox />
            </View>
            <View style={tailwind('flex flex-col mt-5')}>
                <CheckoutBreakDown label="Order cost" value={orderBreakDown.orderCost} />
                <CheckoutBreakDown label="Delivery Fee" value={orderBreakDown.deliveryFee} />
                <CheckoutBreakDown label="Service Fee" onPress={() => serviceFeeAdditionalInfoModalRef?.current?.present()} value={orderBreakDown.systemFee} />
                {discount && <CheckoutBreakDown label="Discount" value={(-Math.abs(discount).toString())} /> }
                <CheckoutBreakDown subTotal={true as any} label="Subtotal" value={orderBreakDown.orderCost + orderBreakDown.deliveryFee + orderBreakDown.systemFee - (discount ?? 0)} />
            </View>

            <View style={tailwind('mt-5 mb-10')}>
                <SlideToOrderButton
                    ref={slideToOrderRef}
                    totalAmount={`₦${(orderBreakDown.orderCost + orderBreakDown.deliveryFee + orderBreakDown.systemFee - (discount ?? 0)).toLocaleString('en-NG')}`}
                    onOrderComplete={() => setConfirmOrder(true)}
                />
            </View>
            <AddressBookModal
                selectedAddressId={selectedAddress?._id}
                onAddressSelect={setSelectedAddress}
                addressBook={addressBook}
                modalRef={addressModalRef}
                addressLabel={addressLabels}
                onAddNewAddress={() => modalNavigation.navigate(ModalScreenName.MODAL_ADD_ADDRESS_SCREEN as any, {callback: () => navigation.navigate(BasketScreenName.CHECKOUT as any)} as any)}
                promptModalName={ADDRESS_MODAL}
            />
            {vendor !== undefined && (
                <ScheduleDeliveryModal
                    promptModalName={SCHEDULE_MODAL}
                    modalRef={scheduleModalRef}
                    vendor={vendor as any}
                    onScheduleSet={setDeliveryItem}
                    startDate={cart.cartItemAvailableDate}
                    endDate={cart.cartItemAvailableDate}
                />
            )}

            <PaymentMethodModal
                promptModalName={PAYMENT_METHOD_MODAL}
                modalRef={paymentModalRef}
                selectedPaymentMethod={paymentMethod}
                setSelectedPaymentMethod={setPaymentMethod}
            />
            <AdditionalInfoModal
                modalRef={serviceFeeAdditionalInfoModalRef}
                promptModalName={ADDITIONAL_INFO_MODAL_SERVICE_FEE}

            >
                <View style={tailwind('flex flex-col mb-5')}>
                    <Text style={tailwind('text-base font-bold text-slate-500 mb-3')}>Service fee</Text>
                    <Text style={tailwind('text-sm font-normal text-slate-500')}>10% of your total order capped at N500. This fee goes towards maintaining the platform and payment processing cost ensuring you get reliable service</Text>
                </View>
            </AdditionalInfoModal>
        </ScrollView>
    )
}
