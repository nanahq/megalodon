import {ScrollView, Text, View} from "react-native";
import React, {useCallback, useEffect, useRef, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {BasketParamsList} from "@screens/AppNavigator/Screens/basket/BasketNavigator";
import {getColor, tailwind} from "@tailwind";
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
import Checkbox from "expo-checkbox";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {ScheduleDeliveryModal} from "@screens/AppNavigator/Screens/basket/components/schedule/ScheduleModal";
import {ScheduleDeliveryBox} from "@screens/AppNavigator/Screens/basket/components/schedule/ScheduleDeliveryBox";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import {deleteCartFromStorage} from "@store/cart.reducer";
import moment from "moment";
import {parseSelectedScheduledDateTime} from "../../../../../utils/DateFormatter";

export const ADDRESS_MODAL = 'ADDRESS_MODAL'
export const SCHEDULE_MODAL = 'SCHEDULE_MODAL'
export const Checkout: React.FC = () => {

    // App state
    const [view, setView] = useState<VendorOperationType>("ON_DEMAND")
    const [vendor, setVendor] = useState<VendorUserI | undefined>(undefined)
    const [selectedAddress, setSelectedAddress] = useState<any | undefined>(undefined)
    const [isThirdParty, setIsThirdParty] = useState<boolean>(false)
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

    // App store
    const state = useAppSelector((state: RootState) => state.vendors)
    const cartState = useAppSelector((state: RootState) => state.cart)
    const userProfile = useAppSelector((state: RootState) => state.profile)
    const dispatch = useAppDispatch()
    const {addressBook, addressLabels} = useAppSelector((state: RootState) => state.addressBook)
    const navigation = useNavigation<NavigationProp<BasketParamsList>>()
    const modalNavigation = useNavigation<NavigationProp<AppParamList>>()
    const addressModalRef = useRef<any>(null)
    const scheduleModalRef = useRef<any>(null)
    const toast = useToast()
    const openModal = useCallback(() => {
        addressModalRef.current.present()
    }, [])

    const openScheduleModal =  useCallback(() => {
        scheduleModalRef.current.present()
    }, [])

    useEffect(() => {
        async function fetchDeliveryFee () {
            if (vendor !== undefined) {
                try {
                    const response = (await _api.requestData<{userCoords: number[], vendorCoords: number[]}>({
                        method: 'POST',
                        url: '/location/delivery-fee',
                        data: {
                            userCoords: selectedAddress?.location?.coordinates ?? [0, 0],
                            vendorCoords: vendor.location?.coordinates ?? [0, 0],
                        }
                    })).data as DeliveryFeeResult

                    setOrderBreakdown((prevState) => ({
                        ...prevState,
                        deliveryFee: response.fee
                    }))

                    setDeliveryEta((prevState) => ({...prevState, ...response}))
                } catch (error) {
                    showTost(toast, 'failed to fetch delivery fee', 'error')
                }
            }
        }

        void fetchDeliveryFee()
    }, [selectedAddress?._id, userProfile.profile, vendor])


    useEffect(() => {
        async function fetchConstants (): Promise<void> {
            try {
                const response = (await _api.requestData<undefined>({
                    method: 'GET',
                    url: '/general/app-constants'
                })).data as AppConstants

                    setOrderBreakdown((prevState) => ({...prevState, vat: response.cart.VAT_FEE, systemFee: response.cart.SERVICE_FEE}))
                    } catch (error) {
                showTost(toast, 'failed to fetch cart constants', 'error')
            } finally {
                setFetchingConstants(false)
            }
        }
        if (fetchingConstant) {
            void fetchConstants()
        }
    }, [])

    useEffect(() => {
        if (cartState.cart) {
            const totalCartValue = cartState.cart.reduce((total, cartItem) => {
                const basePrice = Number(cartItem.cartItem.price) * cartItem.quantity;
                const optionPrice = cartItem.options.reduce((totalOptionsPrice: any, option: any) => {
                    return totalOptionsPrice + Number(option.price);
                }, 0);
                const itemTotalValue = basePrice + optionPrice;
                return total + itemTotalValue;
            }, 0);

            const vat = (totalCartValue / 100) * 7

            setOrderBreakdown((prev) => ({...prev, orderCost: totalCartValue, vat}))
        }

    }, [cartState.cart, fetchingConstant])

    useEffect(() => {
        if (state.vendors?.length) {
            const v = state.vendors.find( _ =>  _._id === cartState.vendor)
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
            setView(() => _view)
        }
    }, [state.vendors, cartState.vendor])
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Delivery Details',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle:tailwind('font-bold text-3xl'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.navigate(BasketScreenName.SINGLE_BASKET, {})} />,
        })
    }, [])


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
            orderValuePayable: Object.values(orderBreakDown).reduce((a, r) => a + r),
            preciseLocation: {
                type: 'Point',
                coordinates: selectedAddress?.location?.coordinates
            },
            primaryContact: userProfile.profile.phone,
            vendor: vendor?._id ?? '',
            totalOrderValue: Object.values(orderBreakDown).reduce((a, r) => a + r),
            quantity: cartState.cart?.map(crt => {
                return {
                    listing: crt.cartItem._id,
                    quantity: crt.quantity
                }
            }) ?? []
        }
       try {
            setPlacingOrder(true)
           const response = (await _api.requestData<any>({
               method:'POST',
               url: 'order/create',
               data: payload
           })).data?.data as {order: OrderI, paymentMeta: {authorization_url: string, reference: string}}

            dispatch(deleteCartFromStorage())

           navigation.navigate(ModalScreenName.MODAL_PAYMENT_SCREEN, {
               order: response.order,
               meta: response.paymentMeta
           })
           // Reset navigation stack to 'ORDERS' screen
           navigation.reset({
               index: 0,
               routes: [{ name: BasketScreenName.BASKET }],
           });
       }  catch (error) {
           showTost(toast, 'Failed to place order. Contact support', 'error')
       } finally {
           setPlacingOrder(false)
       }
    }

    const check = (): boolean => {
        let isBlocked: boolean

        if (view === 'ON_DEMAND') {
            isBlocked = selectedAddress === undefined
        } else  {
            isBlocked = [selectedAddress, deliveryTime ].includes(undefined)

        }
        return isBlocked
    }

    return (
        <ScrollView style={tailwind('flex-1 bg-white px-4')}>
            <CheckoutButton vendorType={vendor?.settings.deliveryType ?? 'ON_DEMAND'} view={view} onButtonClick={setView}  />
            <DeliveryAddressBox onPress={() => openModal() } selectedAddress={selectedAddress} />
            { view === 'ON_DEMAND' && deliveryEta !== undefined && vendor !== undefined && (
                <View style={tailwind('mt-10')}>
                   <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                       <Text>Delivery Food with be with you in</Text>
                       <Text>{Number(deliveryEta.duration) + Number(vendor.settings.preparationTime)} Minutes</Text>
                 </View>
                </View>
            )}

            {view === 'PRE_ORDER' && (
                <ScheduleDeliveryBox
                    onPress={openScheduleModal}
                    selectedDate={deliveryTime}
                />
            )}
            <View style={tailwind('flex my-6 flex-row items-center w-full justify-between')}>
                <Text style={tailwind('text-lg')}>
                    Buying for someone else?
                </Text>
                <Checkbox style={{margin: 8}} color={isThirdParty ? getColor('primary-500') : undefined} value={isThirdParty} onValueChange={(value) => setIsThirdParty(value)} />
            </View>
            {isThirdParty && (
                <View style={tailwind('flex flex-col')}>
                    <TextInputWithLabel containerStyle={tailwind('mb-5')} label="Receiver first" />
                    <TextInputWithLabel containerStyle={tailwind('mb-5')} label="Receiver phone" />
                </View>
            )}
            <View style={tailwind('flex flex-col mt-5')}>
                <CheckoutBreakDown label="Subtotal" value={orderBreakDown.orderCost} />
                <CheckoutBreakDown label="Delivery Fee" value={orderBreakDown.deliveryFee} />
                <CheckoutBreakDown label="Service Fee (Tax included)" value={orderBreakDown.systemFee + orderBreakDown.vat} />
            </View>

            <View style={tailwind('my-5')}>
                <GenericButton  loading={placingOrder} disabled={check()} onPress={placeOrder} labelColor={tailwind('text-white font-bold')}  label="Place order" backgroundColor={tailwind('bg-black')} />
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

        </ScrollView>
    )
}


