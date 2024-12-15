import {View, Text, ScrollView,} from "react-native";
import {tailwind} from "@tailwind";
import {BoxDeliveryAddressBox} from "@screens/AppNavigator/Screens/modals/components/address-box";

import React, {useEffect, useRef, useState} from "react";
import {AddressBookI, DeliveryFeeResult, internationalisePhoneNumber, OrderI, OrderTypes} from "@nanahq/sticky";
import {SafeAreaView} from "react-native-safe-area-context";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {StackScreenProps} from "@react-navigation/stack";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {BoxAddressModal} from "@screens/AppNavigator/Screens/modals/components/add-delivery-pickup-box";
import {useAddress} from "@contexts/address-book.provider";
import {_api} from "@api/_request";
import {useLoading} from "@contexts/loading.provider";
import {CheckoutBreakDown} from "@screens/AppNavigator/Screens/basket/components/CheckoutBreakDown";
import {SlideToOrderButton, SlideToOrderRef} from "@components/commons/buttons/SliderButton";
import {AdditionalInfoModal} from "@screens/AppNavigator/Screens/basket/components/AdditionalInforModal";
import {ADDITIONAL_INFO_MODAL_SERVICE_FEE} from "@screens/AppNavigator/Screens/basket/Checkout";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useProfile} from "@contexts/profile.provider";
import moment from "moment/moment";

import {showTost} from "@components/commons/Toast";
import {mutate} from "swr";
import {useToast} from "react-native-toast-notifications";



export const PICKUP_ADDRESS_MODAL = 'PICKUP_ADDRESS_MODAL'
export const DESTINATION_ADDRESS_MODAL = 'DESTINATION_ADDRESS_MODAL'
type  BoxDeliveryAddressModalProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_BOX_SCREEN>
export const BoxDeliveryAddress: React.FC<BoxDeliveryAddressModalProps>  = ({navigation, route}) => {
    const {profile} = useProfile()
    const [pickupAddress, setPickupAddress] = useState<AddressBookI | undefined>(undefined)
    const [destinationAddress, setDestinationAddress] = useState<AddressBookI | undefined>(undefined)
    const PickupModalRef = useRef<any>(null)
    const DestinationModalRef = useRef<any>(null)
    const {addressBook, addressLabels} = useAddress()
    const {setLoadingState} = useLoading()
    const [deliveryPricing, setDeliveryFeeResult] = useState<DeliveryFeeResult | undefined>(undefined)
    const serviceFeeAdditionalInfoModalRef = useRef<any>(null)
    const slideToOrderRef = useRef<SlideToOrderRef | null>(null);
    const [comment, setComment] = useState('')
    const [thirdPartyName, setThirdPartyName] = useState('')
    const [thirdPartyPhone, setThirdPartyPhone] = useState('')
    const [confirmOrder, setConfirmOrder] = useState(false)

    const toast = useToast()
    const isSendType = route.params.deliveryType.toLowerCase().includes('send')

    useEffect(() => {

        if(Boolean(pickupAddress?.address) && Boolean(destinationAddress?.address)) {
            void fetchDeliveryFee()
        }
    }, [pickupAddress?.address, destinationAddress?.address])

    const handleOpenPickupAddressModal = () => {
        PickupModalRef?.current?.present()
    }

    const handleOpenDestinationAddressModal = () => {
        DestinationModalRef?.current?.present()
    }


    useEffect(() => {
        if(confirmOrder) {
            void placeOrder()
        }
    }, [confirmOrder])

    const fetchDeliveryFee = async () => {
        try {
            setLoadingState(true)
            const { data } = await _api.requestData<{userCoords: any, vendorCoords: any}, DeliveryFeeResult>({
                method: "POST",
                url: "location/delivery-fee",
                data: {
                    userCoords: [pickupAddress?.location.coordinates[0], pickupAddress?.location.coordinates[1]],
                    vendorCoords: [destinationAddress?.location.coordinates[0], destinationAddress?.location.coordinates[1]] ,
                },
            });
            setDeliveryFeeResult(data)
        } catch (error) {

        } finally {
            setLoadingState(false)

        }
    }

    const check = (): { isBlocked: boolean, type: "ADDRESS"  | "DELIVERY_TIME" | "PAYMENT_METHOD" | "NONE"} => {
        if(!Boolean(thirdPartyName)) {
            setConfirmOrder(false)
            showTost(toast, `Please add the name of the ${isSendType ? 'receiver' : 'sender'} `, 'error')
            return {
                isBlocked: true,
                type: "DELIVERY_TIME"
            }
        }

        if(!Boolean(thirdPartyPhone)) {
            setConfirmOrder(false)
            showTost(toast, `Please add the phone number of the ${isSendType ? 'receiver' : 'sender'} `, 'error')
            return {
                isBlocked: true,
                type: "DELIVERY_TIME"
            }
        }


        return {isBlocked: false, type: "NONE"}
    }

    const placeOrder = async () => {
        const {isBlocked} = check()

        if(isBlocked) {
            slideToOrderRef.current?.reset()
            return
        }

        const payload = {
            user: profile._id,
            deliveryAddress: destinationAddress?.address ?? '',
            pickupAddress: pickupAddress?.address ?? '',
            listing: [process.env.EXPO_PUBLIC_COURIER_LISTING],
            isThirdParty: true,
            orderType:  OrderTypes.INSTANT ,
            options: [],
            orderBreakDown: {
                deliveryFee: deliveryPricing?.fee ?? 0,
                vat: 0,
                orderCost: 0,
                systemFee: 300
            },
            orderDeliveryScheduledTime:moment().add(`${Number(15) + Number(deliveryPricing?.duration ?? 0)}`, 'minutes'),
            orderValuePayable: deliveryPricing?.fee + 300,
            preciseLocation: {
                type: 'Point',
                coordinates: destinationAddress?.location?.coordinates
            },
            precisePickupLocation: {
                type: 'Point',
                coordinates: pickupAddress?.location?.coordinates
            },
            primaryContact: internationalisePhoneNumber(thirdPartyPhone),
            thirdPartyName,
            vendor: process.env.EXPO_PUBLIC_COURIER_VENDOR ?? '',
            totalOrderValue: deliveryPricing?.fee + 300,
            quantity:  [
                {
                    listing: process.env.EXPO_PUBLIC_COURIER_LISTING,
                    quantity: 1
                }
            ],
            coupon:  undefined,
            paymentType:  'PAY_ONLINE'
        }
        try {
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

        }  catch (error) {
            console.error(error)
            showTost(toast, 'Failed to place order. Contact support', 'error')
        } finally {
            slideToOrderRef.current?.reset()
            setLoadingState(false)
            void mutate('user/profile')
        }
    }

    return (
        <SafeAreaView style={tailwind('flex-1 h-full bg-white py-4 px-5')}>
           <ScrollView showsVerticalScrollIndicator={false}>
               <ModalCloseIcon onPress={() => navigation.goBack()} />
               <View style={tailwind('mt-10')}>
                   <Text style={tailwind('font-bold text-2xl text-slate-900')}>Get anything picked up and delivered.</Text>
               </View>
               <View>
                   <BoxDeliveryAddressBox
                       defaultText="Add a pickup location"
                       selectedAddress={pickupAddress}
                       onPress={handleOpenPickupAddressModal}
                   />
                   <BoxDeliveryAddressBox
                       defaultText="Add a destination location"
                       selectedAddress={destinationAddress}
                       onPress={handleOpenDestinationAddressModal}
                   />
               </View>

               {deliveryPricing !== undefined && (
                   <>
                       <View style={tailwind('my-5')}>
                           <View style={tailwind('my-5')}>
                               <TextInputWithLabel
                                   value={thirdPartyName}
                                   onChangeText={text => setThirdPartyName(text)}
                                   label={ isSendType ? `Sender's name` : `Receiver's name`}/>
                               <TextInputWithLabel
                                   value={thirdPartyPhone}
                                   onChangeText={text => setThirdPartyPhone(text)}
                                   label={isSendType?  `Sender's phone number` : `Receiver's  phone number`}/>
                           </View>

                           <View>
                               <TextInputWithLabel
                                   label="Add instruction for driver"
                                   moreInfo="optional"
                                   value={comment}
                                   onChangeText={value => setComment(value)}
                                   textAlignVertical="top"
                                   multiline
                                   numberOfLines={4}
                                   style={[tailwind('p-2 bg-slate-100 rounded text-slate-900 '), {height: 100}]}
                                   placeholder=''
                               />
                           </View>
                       </View>
                       <View style={tailwind('flex flex-col mt-5')}>
                           <CheckoutBreakDown label="Delivery Fee" value={deliveryPricing?.fee ?? 0} />
                           <CheckoutBreakDown label="Additional Charge" onPress={() => serviceFeeAdditionalInfoModalRef?.current?.present()} value={300} />
                           <CheckoutBreakDown subTotal={true as any} label="Subtotal" value={deliveryPricing?.fee + 300} />
                       </View>

                       <View style={tailwind('mt-5 mb-10')}>
                           <SlideToOrderButton
                               ref={slideToOrderRef}
                               totalAmount={`₦${(deliveryPricing?.fee  + 300).toLocaleString('en-NG')}`}
                               onOrderComplete={() => setConfirmOrder(true)}
                           />
                       </View>
                   </>
               )}
               <BoxAddressModal
                   title="Pickup location"
                   modalRef={PickupModalRef}
                   promptModalName={PICKUP_ADDRESS_MODAL}
                   addressLabel={addressLabels}
                   addressBook={addressBook}
                   onAddressSelect={(address) => setPickupAddress(address)}

               />

               <BoxAddressModal
                   title="Destination location"
                   modalRef={DestinationModalRef}
                   promptModalName={DESTINATION_ADDRESS_MODAL}
                   addressLabel={addressLabels}
                   addressBook={addressBook}
                   onAddressSelect={(address) => setDestinationAddress(address)}
               />

               <AdditionalInfoModal
                   modalRef={serviceFeeAdditionalInfoModalRef}
                   promptModalName={ADDITIONAL_INFO_MODAL_SERVICE_FEE}

               >
                   <View style={tailwind('flex flex-col mb-5')}>
                       <Text style={tailwind('text-base font-bold text-slate-500 mb-3')}>Additional fee</Text>
                       <Text style={tailwind('text-sm font-normal text-slate-500')}>Additional N300 is added to the delivery fee</Text>
                   </View>
               </AdditionalInfoModal>
           </ScrollView>
        </SafeAreaView>
    )
}
