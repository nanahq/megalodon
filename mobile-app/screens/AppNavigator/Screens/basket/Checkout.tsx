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
    OrderTypes, VendorI,
    VendorOperationType,
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
    const [vendor, setVendor] = useState<VendorI | undefined>(undefined)
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


    console.log(cartState.vendor)

    return <></>


}


