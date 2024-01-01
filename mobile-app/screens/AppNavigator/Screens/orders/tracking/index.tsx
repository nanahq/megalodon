import {Image, Pressable, ScrollView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {HeaderStyleInterpolators, StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import {tailwind} from "@tailwind";
import {OrderI, OrderStatus, SOCKET_MESSAGE} from "@nanahq/sticky";
import {Map} from "@screens/AppNavigator/Screens/orders/tracking/components/Map";
import {useWebSocket} from "@contexts/SocketProvider";
import {StatusBar} from "expo-status-bar";
import PrepareRestaurant from '@assets/app/restaurant-prepare.png'
import OrderComplete from '@assets/app/order-complete.png'
import moment from "moment";
import {DeliveryInfo} from "@screens/AppNavigator/Screens/orders/tracking/components/DeliveryInfo";
import {GenericButton} from "@components/commons/buttons/GenericButton";


type TrackingProps = StackScreenProps<OrderParamsList, OrderScreenName.TRACK_ORDER>

const guideline: Record<string, number> =  {
        'ORDER_PLACED': 1,
        'COURIER_PICKUP': 2,
        'COLLECTED_FROM_VENDOR': 3,
        'DELIVERED_TO_CUSTOMER': 4,
    }
export const Tracking: React.FC<TrackingProps> = ({navigation, route}) => {
    const {isConnected, socketClient} = useWebSocket()
    // @ts-ignore
    const [activeStep, setActiveStep] = useState<number>(guideline[route.params.order.orderStatus as OrderStatus])
    // const [delivery,setDelivery] = useState()

    const [order, setOrder] = useState<OrderI>(route.params.order)

    useEffect(() => {
        if (isConnected && socketClient !== undefined) {
           socketClient?.on(SOCKET_MESSAGE.UPDATE_ORDER_STATUS, (message: {userId: string, orderId: string, status: OrderStatus, driver: string, vendorName?: string}) => {
               const isOrder = message.orderId === route.params.order._id
               if (isOrder) {
                   setOrder(prev => ({...prev, orderStatus: message.status}))
                   setActiveStep(() => guideline[message.status] as number)

                   switch (message.status) {
                       case OrderStatus.FULFILLED:
                           navigation.setOptions({
                               headerShown: true,
                           })
                           break;
                       default:
                   }
               }
           })
        }

    }, [])

    useEffect(() => {
        navigation.setOptions({
            headerShown: order.orderStatus !== OrderStatus.IN_ROUTE,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl hidden'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
            headerRight: () => <HelpButton />,
            headerStyleInterpolator: HeaderStyleInterpolators.forFade
        })
    }, [order.orderStatus])

    const text = () => {
        switch (order.orderStatus ) {
            case OrderStatus.PROCESSED:
                return 'Preparing Your Order....'

            case OrderStatus.COURIER_PICKUP:
                return 'Delivery guy picking up your order'
            case OrderStatus.COLLECTED:
                return 'Delivery guy has picked up your order'

            default:
                return 'Your Food has been delivered. Enjoy Your Order'
        }
    }

    const getStatusBarStyle = () => {
        switch (order.orderStatus) {
            case OrderStatus.PROCESSED:
            case OrderStatus.COURIER_PICKUP:
            case OrderStatus.COLLECTED:

                return '#00C2E8';

            case OrderStatus.IN_ROUTE:
                return '#41a550'

            default:
                return 'dark-content';
        }
    };

    return (
        <View style={tailwind('flex-1')}>
            {order.orderStatus !== OrderStatus.FULFILLED && (
                <StatusBar animated={true as any} style={"auto"  as any}  networkActivityIndicatorVisible={false} backgroundColor={getStatusBarStyle()} />
            )}
            {order.orderStatus !== OrderStatus.IN_ROUTE ? (
               <ScrollView style={tailwind('flex-1 bg-white pb-6')}>
                   <View style={tailwind('px-4')}>
                       <View style={tailwind('my-4')}>
                           <Text style={tailwind('text-2xl')}>{text()}</Text>
                           {order.orderStatus !== OrderStatus.FULFILLED && (
                               <Text style={tailwind('mt-2')}>Latest Arrival by {moment(order.orderType === "PRE_ORDER" ? order.orderDeliveryScheduledTime : order.orderDeliveryScheduledTime).format('HH:mm Do MMM')}</Text>
                           )}
                       </View>
                       <View style={tailwind('flex flex-row')}>
                           {Array(4).fill(0).map((_, index) => {
                               return (
                                   <View key={index} style={[tailwind("flex items-center py-1 rounded-sm mr-2 ", {
                                       'bg-brand-gray-700': activeStep <= index,
                                       'bg-primary-500': activeStep > index,
                                   }), {width: 80}]} />
                               )
                           })}
                       </View>
                       {order.orderStatus === OrderStatus.FULFILLED && (
                           <View style={tailwind('mt-5')}>
                               <Text>
                                   Our delivery guys and {order.vendor.businessName} worked their magic for you. Take a minute to
                                   rate, tip, and say thanks.
                               </Text>
                           </View>
                       )}
                   </View>
                   <View style={tailwind('mt-5 bg-brand-ash w-full flex flex-row items-center justify-center')}>
                       {order.orderStatus === OrderStatus.FULFILLED ? (
                           <Image source={OrderComplete} style={{
                               width:280,
                               height:280,
                           }}  />
                       ): (
                           <Image source={PrepareRestaurant} style={{
                               width:280,
                               height:280,
                           }}  />
                       )}
                   </View>
                   <View style={tailwind('px-4 mt-5')}>
                       {order.orderStatus !== OrderStatus.FULFILLED ? (
                           <DeliveryInfo heading="Delivery Details">
                               <DeliveryInfo.Item info={order.deliveryAddress} title="Delivery Address" />
                               <DeliveryInfo.Item info={order.primaryContact} title="Who should receive this order" />
                               <DeliveryInfo.Item info={order.orderType === "PRE_ORDER" ? 'Pre-Order' : 'Instant Delivery'} title="Delivery Type" />
                               <DeliveryInfo.Item info={order.specialNote ?? ''} title="Delivery Instruction" />
                           </DeliveryInfo>
                       ) : (
                           <View style={tailwind('mt-5')}>
                               <GenericButton
                                   onPress={() => navigation.navigate(OrderScreenName.ADD_REVIEW, {
                                       order: order
                                   })}
                                   labelColor={tailwind('font-normal text-white')}
                                   label="Submit a review"
                                   backgroundColor={tailwind('bg-primary-500')}
                               />
                           </View>
                       )}
                   </View>
               </ScrollView>
            ) : <Map order={order} />}

        </View>
    )
}


const HelpButton = () => {
    return (
        <Pressable style={tailwind('rounded-full bg-primary-200 py-1 px-3  mr-4')}>
            <Text style={tailwind('font-medium text-sm')}>
                Help
            </Text>
        </Pressable>
    )
}
