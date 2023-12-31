import {ScrollView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {HeaderStyleInterpolators, StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import React, {PropsWithChildren, useEffect, useMemo, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {MappedDeliveryStatus} from "@constants/MappedDeliveryStatus";
import moment from "moment";
import {IconComponent} from "@components/commons/IconComponent";
import {ListingMenuI, OrderStatus} from "@nanahq/sticky";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {NumericFormat as NumberFormat} from "react-number-format";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import { LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {_api} from "@api/_request";
import AsyncStorage from "@react-native-async-storage/async-storage";

export interface TransformedOrderItem {
    listing: ListingMenuI;
    quantity: number;
    value: number;
}

type UndeliveredSingleOrderScreenProps = StackScreenProps<OrderParamsList, OrderScreenName.UNDELIVERED_SINGLE_ORDER>
export const UndeliveredSingleOrderScreen: React.FC<UndeliveredSingleOrderScreenProps> = ({navigation, route}) => {
    const [rating, setRating] = useState<null | string>(null)

    useEffect(() => {
        navigation.addListener('focus' ,() => {
            AsyncStorage.getItem(route.params.order._id)
                .then(_rating => {
                    setRating(_rating)
                })
        })

        return () => navigation.removeListener('focus', () => {
            AsyncStorage.getItem(route.params.order._id)
                .then(_rating => {
                    setRating(_rating)
                })
        })
    }, [])




    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Order #${route?.params.order.refId}`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
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
                    <Text style={tailwind('text-lg text-brand-gray-700')}>{moment(route.params.order.createdAt).format('DD MMM YYYY HH:mm')}</Text>
                    <Text style={tailwind('font-bold text-3xl w-3/4 mt-2')}>{route.params.order.vendor.businessName}</Text>
                </View>
                <View style={tailwind('mt-10')}>
                    <View style={tailwind('flex flex-col mb-5')}>
                        <Text style={tailwind('text-lg font-bold')}>Delivery</Text>
                        <View style={tailwind('flex flex-row   mt-2 items-center')}>
                            <IconComponent iconType="Ionicons" name="ios-location-outline" size={20} />
                            <Text style={tailwind('text-lg ml-5')}>{route.params.order.deliveryAddress}</Text>
                        </View>
                    </View>
                    <View style={tailwind('flex flex-col mb-5')}>
                        <Text style={tailwind('text-lg font-bold')}>Order Status</Text>
                        <View style={tailwind('flex flex-row   mt-2 items-center')}>
                            <IconComponent iconType="Ionicons" name="ios-cart-outline" size={20} />
                            <View>
                                <Text style={tailwind('text-lg ml-5')}>
                                    {MappedDeliveryStatus[route.params.order.orderStatus]}
                                </Text>
                                {[OrderStatus.FULFILLED, OrderStatus.COURIER_PICKUP, OrderStatus.PROCESSED,  OrderStatus.IN_ROUTE].includes(route.params.order.orderStatus) && (
                                    <Text style={tailwind('text-lg ml-5')}>{ route.params.order.orderStatus === OrderStatus.FULFILLED  ? `Delivered on ${moment(route.params.order.updatedAt).format('DD MMM YYYY HH:mm')}`  : `Delivery by ${moment(route.params.order.orderDeliveryScheduledTime).format('HH:mm Do MMM')}` } </Text>
                                )}
                            </View>
                        </View>
                    </View>
                    <View style={tailwind('flex flex-col mb-5')}>
                        <Text style={tailwind('text-lg font-bold')}>Total in Naira</Text>
                        <View style={tailwind('flex flex-row  mt-2  items-center')}>
                            <IconComponent iconType="Ionicons" name="ios-pricetags-outline" size={20} />
                            <NumberFormat
                                prefix='₦'
                                value={route.params.order.orderValuePayable}
                                thousandSeparator
                                displayType="text"
                                renderText={(value) => (
                                    <Text
                                        style={tailwind('text-lg ml-5')}
                                    >
                                        {value}
                                    </Text>
                                )}
                            />
                        </View>
                    </View>
                </View>
                <View style={tailwind('my-10')}>
                    {route.params.order.orderStatus === OrderStatus.FULFILLED && !rating && (
                        <>
                            <GenericButton style={tailwind('mt-4')} onPress={() => navigation.navigate(OrderScreenName.ADD_REVIEW, {
                                order: route.params.order
                            }) } label="Add A Review" labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-500 bg-opacity-40')} />
                        </>
                    )}
                    { [OrderStatus.COURIER_PICKUP, OrderStatus.PROCESSED,  OrderStatus.IN_ROUTE].includes(route.params.order.orderStatus) && (
                        <GenericButton onPress={() => navigation.navigate(OrderScreenName.TRACK_ORDER, {
                            order: route.params.order
                        })} label="Track Delivery" labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-500')} />
                    )}
                    {route.params.order.orderStatus === OrderStatus.PAYMENT_PENDING && (
                        <GenericButton onPress={() => navigation.navigate(ModalScreenName.MODAL_PAYMENT_SCREEN, {
                            order: route.params.order
                        })} label="Make payment" labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-500')} />
                    )}
                </View>
                {transformOrder.length > 0 && (
                    <View>
                        <Text style={tailwind('text-2xl font-bold')}>Your order</Text>
                        <View style={tailwind('flex flex-col w-full mt-2 items-center')}>
                            {transformOrder.map((order, index) => (
                                <OrderItemRow key={index}>
                                    <Text style={tailwind('w-2/3')}>{order.listing.name}</Text>
                                    <Text>x{order.quantity}</Text>
                                    <NumberFormat
                                        prefix='₦'
                                        value={order.value}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text
                                                style={tailwind('')}
                                            >
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </OrderItemRow>
                            ))}
                            <View style={tailwind(' flex flex-col w-full border-t-0.5 py-2 mt-2 border-brand-gray-700')}>
                                <OrderItemRow>
                                    <Text>Delivery Fee</Text>
                                    <NumberFormat
                                        prefix='₦'
                                        value={route.params.order.orderBreakDown.deliveryFee}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text
                                                style={tailwind('')}
                                            >
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </OrderItemRow>
                                <OrderItemRow>
                                    <Text>Service Fee</Text>
                                    <NumberFormat
                                        prefix='₦'
                                        value={route.params.order.orderBreakDown.systemFee}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text
                                                style={tailwind('')}
                                            >
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </OrderItemRow>
                                <OrderItemRow>
                                    <Text>Tax (VAT)</Text>
                                    <NumberFormat
                                        prefix='₦'
                                        value={route.params.order.orderBreakDown.vat}
                                        thousandSeparator
                                        displayType="text"
                                        renderText={(value) => (
                                            <Text
                                                style={tailwind('')}
                                            >
                                                {value}
                                            </Text>
                                        )}
                                    />
                                </OrderItemRow>
                            </View>
                            <OrderItemRow>
                                <Text style={tailwind('font-bold text-lg')}>Total</Text>
                                <NumberFormat
                                    prefix='₦'
                                    value={route.params.order.orderValuePayable}
                                    thousandSeparator
                                    displayType="text"
                                    renderText={(value) => (
                                        <Text
                                            style={tailwind('font-bold text-lg')}
                                        >
                                            {value}
                                        </Text>
                                    )}
                                />
                            </OrderItemRow>
                        </View>
                    </View>
                )}
                <View style={tailwind('mt-10')}>
                    <Text style={tailwind('text-2xl font-bold')}>Order Information</Text>
                    <View>
                        <View style={tailwind('flex my-2 flex-row  items-center w-full')}>
                           <Text>Order RefId</Text>
                           <Text style={tailwind('font-bold ml-5')}>{route.params.order.refId}</Text>
                        </View>
                        <View style={tailwind('flex my-2 flex-row  items-center w-full')}>
                            <Text>Order ID</Text>
                            <Text style={tailwind('font-bold ml-5')} >{route.params.order._id}</Text>
                        </View>
                        <View style={tailwind('flex my-2 flex-row  items-center w-full')}>
                            <Text>Support</Text>
                            <Text style={tailwind('font-bold ml-5')}>support@nanaeats.com</Text>
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
