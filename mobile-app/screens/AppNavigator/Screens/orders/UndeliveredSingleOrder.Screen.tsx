import {ScrollView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {HeaderStyleInterpolators, StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import React, {PropsWithChildren, useEffect, useMemo} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {MappedDeliveryStatus} from "@constants/MappedDeliveryStatus";
import moment from "moment";
import {ListingMenuI, OrderStatus} from "@nanahq/sticky";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NumericFormat as NumberFormat} from "react-number-format";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {useAnalytics} from "@segment/analytics-react-native";
import {BadgeDollarSign, ShoppingCart} from "lucide-react-native";

export interface TransformedOrderItem {
    listing: ListingMenuI;
    quantity: number;
    value: number;
}

type UndeliveredSingleOrderScreenProps = StackScreenProps<OrderParamsList, OrderScreenName.UNDELIVERED_SINGLE_ORDER>
export const UndeliveredSingleOrderScreen: React.FC<UndeliveredSingleOrderScreenProps> = ({navigation, route}) => {
    const analytics = useAnalytics()



    useEffect(() => {
        void analytics.screen(OrderScreenName.UNDELIVERED_SINGLE_ORDER)
    }, [])


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Order #${route?.params.order.refId}`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl font-bold'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
            headerStyleInterpolator: HeaderStyleInterpolators.forFade
        })
    }, [])


     const transformOrder = useMemo(() => {
            const order = route.params.order as any
             const transformedItems: TransformedOrderItem[] = [];
             order.listing.forEach((listingItem: any, index: number) => {
                 const quantity = order.quantity[index]?.quantity || 0;
                 const basePrice = Number(listingItem.price) * quantity;
                 transformedItems.push({
                     listing: listingItem,
                     quantity,
                     value: basePrice,
                 });
             });

             return transformedItems;

     }, [route.params.order._id])

    return (
        <ScrollView style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('px-4 py-5')}>
                <View>
                    <Text style={tailwind('text-slate-900 font-normal text-base')}>{moment(route.params.order.createdAt).format('DD MMM YYYY HH:mm')}</Text>
                    <Text style={tailwind('text-lg text-slate-900 font-medium mt-2')}>{route.params.order.vendor.businessName}</Text>
                </View>
                <View style={tailwind('mt-5')}>
                    <View style={tailwind('flex flex-col mb-5')}>
                        <Text style={tailwind('text-base text-slate-900 font-medium')}>Delivery</Text>
                        <View style={tailwind('flex flex-row mt-2 items-center')}>
                            <ShoppingCart color="#000000" size={20} />
                            <Text style={tailwind('ml-5 text-slate-900 font-normal text-base')}>{route.params.order.deliveryAddress}</Text>
                        </View>
                    </View>
                    <View style={tailwind('flex flex-col mb-5')}>
                        <Text style={tailwind('text-base text-slate-900 font-medium')}>Order Status</Text>
                        <View style={tailwind('flex flex-row mt-2 items-center')}>
                            <ShoppingCart color="#000000" size={20} />
                            <View>
                                <Text style={tailwind('ml-5 font-normal text-slate-900 text-base')}>
                                    {MappedDeliveryStatus[route.params.order.orderStatus]}
                                </Text>
                                {[OrderStatus.FULFILLED, OrderStatus.COURIER_PICKUP, OrderStatus.PROCESSED,  OrderStatus.IN_ROUTE].includes(route.params.order.orderStatus) && (
                                    <Text style={tailwind('ml-5 font-normal text-slate-900 text-xs')}>{ route.params.order.orderStatus === OrderStatus.FULFILLED  ? `Delivered on ${moment(route.params.order.updatedAt).format('DD MMM YYYY HH:mm')}`  : `Delivery by ${moment(route.params.order.orderDeliveryScheduledTime).format('HH:mm Do MMM')}` } </Text>
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={tailwind('flex flex-col mb-5')}>
                        <Text style={tailwind('text-base text-slate-900 font-medium')}>Total in Naira</Text>
                        <View style={tailwind('flex flex-row  mt-2  items-center')}>
                            <BadgeDollarSign color="#000000" size={20} />
                            <NumberFormat
                                prefix='₦'
                                value={route.params.order.orderValuePayable}
                                thousandSeparator
                                displayType="text"
                                renderText={(value) => (
                                    <Text
                                        style={tailwind('ml-5 text-slate-900 text-base font-normal')}
                                    >
                                        {value}
                                    </Text>
                                )}
                            />
                        </View>
                    </View>
                </View>
                <View style={tailwind('mb-5')}>
                    {route.params.order.orderStatus === OrderStatus.FULFILLED && !route?.params?.order?.review && (
                        <>
                            <GenericButton style={tailwind('mt-2')} onPress={() => {
                                void analytics.track('CLICK:ORDER-ADD-REVIEW')
                                navigation.navigate(OrderScreenName.ADD_REVIEW, {
                                    order: route.params.order
                                })
                            } } label="Add A Review" labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-100')} />
                        </>
                    )}
                    { [OrderStatus.COURIER_PICKUP, OrderStatus.PROCESSED,  OrderStatus.IN_ROUTE].includes(route.params.order.orderStatus) && (
                        <GenericButton onPress={() => {
                            void analytics.track('CLICK:ORDER-TRACK-DELIVERY')
                            navigation.navigate(OrderScreenName.TRACK_ORDER, {
                                order: route.params.order
                            })
                        }} label="Track Delivery" labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-100')} />
                    )}
                    {route.params.order.orderStatus === OrderStatus.PAYMENT_PENDING && (
                        <GenericButton onPress={() => {
                            void analytics.track('CLICK:ORDER-MAKE-PAYMENT')
                            navigation.navigate(ModalScreenName.MODAL_PAYMENT_SCREEN, {
                                order: route.params.order
                            } as any)
                        } } label="Make payment" labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-100')} />
                    )}
                </View>
                {transformOrder.length > 0 && (
                    <View>
                        <Text style={tailwind('text-base font-medium text-slate-900')}>Your order</Text>
                        <View style={tailwind('flex flex-col w-full mt-2 items-center')}>
                            {transformOrder.map((order, index) => (
                                <OrderItemRow key={index}>
                                    <Text style={tailwind('w-2/3 text-slate-900 text-base font-normal')}>{order.listing.name}</Text>
                                    <Text style={tailwind('text-slate-900 text-base font-normal')}>x{order.quantity}</Text>
                                    <NumberFormat
                                        prefix='₦'
                                        value={order.value}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text
                                                style={tailwind('text-slate-900 text-base font-normal')}
                                            >
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </OrderItemRow>
                            ))}
                            <View style={tailwind(' flex flex-col w-full border-t-0.5 py-2 mt-2 border-brand-gray-700')}>
                                <OrderItemRow>
                                    <Text style={tailwind('text-slate-900 text-base font-normal')}>Delivery Fee</Text>
                                    <NumberFormat
                                        prefix='₦'
                                        value={route.params.order.orderBreakDown.deliveryFee}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text
                                                style={tailwind('text-slate-900 text-base font-normal')}
                                            >
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </OrderItemRow>
                                <OrderItemRow>
                                    <Text style={tailwind('text-slate-900 text-base font-normal')}>Service Fee</Text>
                                    <NumberFormat
                                        prefix='₦'
                                        value={route.params.order.orderBreakDown.systemFee}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text
                                                style={tailwind('text-slate-900 text-base font-normal')}
                                            >
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </OrderItemRow>
                            </View>
                            <OrderItemRow>
                                <Text style={tailwind('text-base font-medium text-slate-900')}>Total</Text>
                                <NumberFormat
                                    prefix='₦'
                                    value={route.params.order.orderValuePayable}
                                    thousandSeparator
                                    displayType="text"
                                    renderText={(value) => (
                                        <Text
                                            style={tailwind('text-slate-900 text-base font-medium')}
                                        >
                                            {value}
                                        </Text>
                                    )}
                                />
                            </OrderItemRow>
                        </View>
                    </View>
                )}
                <View style={tailwind('mt-5')}>
                    <Text style={tailwind('text-base font-medium text-slate-900')}>Order Information</Text>
                    <View>
                        <View style={tailwind('flex my-2 flex-row  items-center w-full')}>
                           <Text style={tailwind('text-slate-900 text-base font-normal')}>Order RefId</Text>
                           <Text style={tailwind('text-slate-900 text-sm  font-normal ml-5')}>{route.params.order.refId}</Text>
                        </View>
                        <View style={tailwind('flex my-2 flex-row  items-center w-full')}>
                            <Text  style={tailwind('text-slate-900 text-base font-normal')}>Order ID</Text>
                            <Text style={tailwind('text-slate-900 text-sm  font-normal ml-5')} >{route.params.order._id}</Text>
                        </View>
                        <View style={tailwind('flex my-2 flex-row  items-center w-full')}>
                            <Text  style={tailwind('text-slate-900 text-base font-normal')}>Contact email</Text>
                            <Text style={tailwind('text-slate-900 text-sm  font-normal ml-5')}>support@trynanaapp.com</Text>
                        </View>
                    </View>
                </View>
            </View>
        </ScrollView>
    )
}

const OrderItemRow: React.FC<PropsWithChildren<{}>> = (props) => {
    return (
        <View style={tailwind('flex my-2 flex-row justify-between items-center w-full')}>
            {props.children}
        </View>
    )
}
