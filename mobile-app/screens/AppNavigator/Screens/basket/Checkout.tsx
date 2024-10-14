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
    VendorUserI,
} from "@nanahq/sticky";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {CheckoutBreakDown} from "@screens/AppNavigator/Screens/basket/components/CheckoutBreakDown";
import {DeliveryAddressBox} from "@screens/AppNavigator/Screens/basket/components/address/DeliveryAddressBox";
import {AddressBookModal} from "@screens/AppNavigator/Screens/basket/components/address/AddressModal";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {ScheduleDeliveryModal} from "@screens/AppNavigator/Screens/basket/components/schedule/ScheduleModal";
import {ScheduleDeliveryBox} from "@screens/AppNavigator/Screens/basket/components/schedule/ScheduleDeliveryBox";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import {deleteCartFromStorage} from "@store/cart.reducer";
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
import {fetchProfile} from "@store/profile.reducer";
import {parseSelectedScheduledDateTime} from "../../../../../utils/DateFormatter";

export const ADDRESS_MODAL = 'ADDRESS_MODAL'
export const SCHEDULE_MODAL = 'SCHEDULE_MODAL'

export const PAYMENT_METHOD_MODAL = 'PAYMENT_METHOD_MODAL'
export const Checkout: React.FC = () => {

    // App state
    const [view, setView] = useState<VendorOperationType>("ON_DEMAND")
    const [vendor, setVendor] = useState<VendorUserI | undefined>(undefined)
    const [selectedAddress, setSelectedAddress] = useState<any | undefined>(undefined)
    const [isThirdParty] = useState<boolean>(false)
    const [deliveryTime, setDeliveryItem] = useState<{time: string, date: string} | undefined>(undefined)
    const [fetchingConstant, setFetchingConstants] = useState<boolean>(true)
    const [deliveryEta, setDeliveryEta] = useState<DeliveryFeeResult | undefined>(undefined)
    const [placingOrder, setPlacingOrder] = useState<boolean>(false)
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
    const cartState = useAppSelector((state: RootState) => state.cart)
    const userProfile = useAppSelector((state: RootState) => state.profile)
    const dispatch = useAppDispatch()
    const {addressBook, addressLabels} = useAppSelector((state: RootState) => state.addressBook)
    const navigation = useNavigation<NavigationProp<BasketParamsList>>()
    const modalNavigation = useNavigation<NavigationProp<AppParamList>>()
    const addressModalRef = useRef<any>(null)
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
    }, [selectedAddress?._id, userProfile.profile, vendor])


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
        if (cartState.cart) {
            const totalCartValue = cartState.cart.reduce((total, cartItem) => {
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

    }, [cartState.cart, fetchingConstant])

    useEffect(() => {
            const v = cartState.vendor
            let _view: VendorOperationType = 'ON_DEMAND'

            // eslint-disable-next-line default-case
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
            setView(() =>cartState.cartItemAvailableDate ? 'PRE_ORDER' : _view)
    }, [ cartState.vendor])
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Delivery Details',
            headerBackTitleVisible: false,
            headerTitleAlign: 'left',
            headerTitleStyle:tailwind('text-lg'),
            headerLeft: () => <ModalCloseIcon size={18} onPress={() => navigation.navigate(BasketScreenName.SINGLE_BASKET, {})} />,
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

    const placeOrder = async () => {
        if (selectedAddress === undefined ){
            return
        }
        const payload = {
            user: '',
            deliveryAddress: selectedAddress?.address ?? '',
            listing: cartState.cart?.map(crt => crt.cartItem._id) ?? [],
            isThirdParty: isThirdParty,
            orderType: view === 'ON_DEMAND' ? OrderTypes.INSTANT : OrderTypes.PRE,
            options: cartState.cart?.map(crt => {
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
            primaryContact: userProfile.profile.phone,
            vendor: vendor?._id ?? '',
            totalOrderValue: Object.values({...orderBreakDown, deliveryFee: 0}).reduce((a, r) => a + r),
            quantity: cartState.cart?.map(crt => {
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
            const response = (await _api.requestData<any, {data: {order: OrderI, paymentMeta: {authorization_url: string, reference: string}}}>({
                method:'POST',
                url: 'order/create',
                data: payload
            })).data

            dispatch(deleteCartFromStorage())

            navigation.navigate(ModalScreenName.MODAL_PAYMENT_SCREEN, {
                order: response.data.order,
                meta: response.data.paymentMeta
            })

            // Reset navigation stack to 'ORDERS' screen
            navigation.reset({
                index: 0,
                routes: [{ name: BasketScreenName.BASKET }],
            });

            void analytics.track('CLICK:ORDER-PLACED', {
                order: response.data.order._id,
                vendor: response.data.order.vendor._id,
                orderValue: orderBreakDown.orderCost + orderBreakDown.deliveryFee + orderBreakDown.systemFee - (discount ?? 0)
            })
        }  catch (error) {
            console.error(error)
            showTost(toast, 'Failed to place order. Contact support', 'error')
        } finally {
            setPlacingOrder(false)
            updateCoupon(undefined)
            dispatch(fetchProfile())
        }
    }

    const check = (): boolean => {
        let isBlocked: boolean

        if (view === 'ON_DEMAND') {
            isBlocked = selectedAddress === undefined
        } else  {
            isBlocked = [selectedAddress, deliveryTime ].includes(undefined)
        }

        if (paymentMethod === undefined) {
            return true
        }
        return isBlocked
    }

    return (
        <ScrollView style={tailwind('flex-1 bg-white px-4')}>
            <CheckoutButton vendorType={cartState.cartItemAvailableDate ? "PRE_ORDER" : vendor?.settings?.operations?.deliveryType ?? 'ON_DEMAND'} view={view} onButtonClick={setView}  />
            <DeliveryAddressBox onPress={() => openModal() } selectedAddress={selectedAddress} />
            { view === 'ON_DEMAND' && selectedAddress !== undefined && deliveryEta !== undefined && vendor !== undefined && (
                <View style={tailwind('mt-10')}>
                    <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                        <Text>Delivery Food with be with you in</Text>
                        {fetchingDeliveryFee ? (
                            <LoaderComponent size="small" />
                        ) : (
                            <Text>{Number(deliveryEta.duration) + Number(vendor.settings?.operations?.preparationTime)} Minutes</Text>
                        )}
                    </View>
                </View>
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
                <CheckoutBreakDown label="Delivery Fee" value={0} />
                <CheckoutBreakDown label="Service Fee" value={orderBreakDown.systemFee} />
                {discount && <CheckoutBreakDown label="Discount" value={(-Math.abs(discount).toString())} /> }
                <CheckoutBreakDown subTotal={true as any} label="Subtotal" value={orderBreakDown.orderCost + 0 + orderBreakDown.systemFee - (discount ?? 0)} />
            </View>

            <View style={tailwind('mt-5 mb-10')}>
                <GenericButton  loading={placingOrder} disabled={check()} onPress={placeOrder} labelColor={tailwind('text-white font-bold')}  label="Place order" backgroundColor={tailwind('bg-primary-100')} />
            </View>
            <AddressBookModal
                selectedAddressId={selectedAddress?._id}
                onAddressSelect={setSelectedAddress}
                addressBook={addressBook}
                modalRef={addressModalRef}
                addressLabel={addressLabels}
                onAddNewAddress={() => modalNavigation.navigate(ModalScreenName.MODAL_ADD_ADDRESS_SCREEN, {callback: () => navigation.navigate(BasketScreenName.CHECKOUT) })}
                promptModalName={ADDRESS_MODAL}
            />
            {vendor !== undefined && (
                <ScheduleDeliveryModal
                    promptModalName={SCHEDULE_MODAL}
                    modalRef={scheduleModalRef}
                    vendor={vendor as any}
                    onScheduleSet={setDeliveryItem}
                    startDate={cartState.cartItemAvailableDate}
                    endDate={cartState.cartItemAvailableDate}
                />
            )}

            <PaymentMethodModal
                promptModalName={PAYMENT_METHOD_MODAL}
                modalRef={paymentModalRef}
                selectedPaymentMethod={paymentMethod}
                setSelectedPaymentMethod={setPaymentMethod}
            />
        </ScrollView>
    )
}
