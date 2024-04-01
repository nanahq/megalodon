import { Pressable, ScrollView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {HeaderStyleInterpolators, StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import {tailwind} from "@tailwind";
import {DeliveryI, OrderI, OrderStatus, SOCKET_MESSAGE} from "@nanahq/sticky";
import {Map} from "@screens/AppNavigator/Screens/orders/tracking/components/Map";
import {useWebSocket} from "@contexts/SocketProvider";
import {StatusBar} from "expo-status-bar";
import {useAnalytics} from "@segment/analytics-react-native";
import {_api} from "@api/_request";
import {mapboxLocationMapper} from "../../../../../../utils/mapboxLocationMappper";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {IconComponent} from "@components/commons/IconComponent";
import {OrderStatusStepper} from "@screens/AppNavigator/Screens/orders/tracking/components/stepper";
import {DeliveryInfo} from "@screens/AppNavigator/Screens/orders/tracking/components/DeliveryInfo";

type TrackingProps = StackScreenProps<OrderParamsList, OrderScreenName.TRACK_ORDER>

const guideline: Record<string, number> =  {
        'ORDER_PLACED': 1,
        'COURIER_PICKUP': 2,
        'COLLECTED_FROM_VENDOR': 3,
        'DELIVERED_TO_CUSTOMER': 4,
    }
export const Tracking: React.FC<TrackingProps> = ({navigation, route}) => {
    const {isConnected, socketClient} = useWebSocket()

    const [fetchingDelivery, setFetchingDelivery] = useState<boolean>(true)
    const [delivery, setDelivery] = useState<DeliveryI | undefined>(undefined)

    const analytics = useAnalytics()

    const [order, setOrder] = useState<OrderI>(route.params.order)

    useEffect(() => {
        void analytics.screen(OrderScreenName.TRACK_ORDER)
        if (isConnected && socketClient !== undefined) {
           socketClient?.on(SOCKET_MESSAGE.UPDATE_ORDER_STATUS, (message: {userId: string, orderId: string, status: OrderStatus, driver: string, vendorName?: string}) => {
               const isOrder = message.orderId === route.params.order._id
               if (isOrder) {
                   setOrder(prev => ({...prev, orderStatus: message.status}))
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


    useEffect(() => {
        const fetchDeliveryInformation = async (): Promise<void> => {
            try {
                const information = (await _api.requestData({
                    method: 'GET',
                    url: `delivery/order/${order._id}`,
                })).data as DeliveryI | undefined;

                setDelivery(() => information);
                // eslint-disable-next-line no-useless-catch
            } catch (error) {
                throw error
            } finally {
                setFetchingDelivery(false);
            }
        };

        void fetchDeliveryInformation();

    }, []);

    if (fetchingDelivery) {
        return <LoaderComponentScreen />
    }

    return (
        <ScrollView style={tailwind('flex-1 bg-white')}>
            {order.orderStatus !== OrderStatus.FULFILLED && (
                <StatusBar animated={true as any} style={"auto"  as any}  networkActivityIndicatorVisible={false} backgroundColor={getStatusBarStyle()} />
            )}
            {delivery !== undefined && <Map delivery={delivery} order={order} />}
            {delivery !== undefined && delivery.assignedToDriver && (
                <View style={tailwind('px-4')}>
                    <View style={tailwind('flex flex-row item-center w-full justify-between')}>
                        <View style={tailwind('flex flex-col')}>
                            <Text style={tailwind('text-xl mb-0.5')}>{`${delivery.driver.firstName} ${delivery.driver.lastName}`}</Text>
                            <Text style={tailwind('font-normal text-base text-gray-500')}>{delivery.driver.totalTrips} trips made</Text>
                        </View>
                        <Pressable style={[tailwind('bg-primary-500 flex flex-row items-center justify-center rounded-full'), {width: 40, height: 40}]}>
                            <IconComponent iconType="AntDesign" name="phone" size={20} style={tailwind('text-white')}/>
                        </Pressable>
                    </View>
                </View>
            ) }
            {delivery !== undefined && (
                <OrderStatusStepper delivery={delivery} />
            )}
            <View style={tailwind('pb-6')}>
                <View style={tailwind('px-4 mt-5')}>
                    <Text style={tailwind('font-bold text-lg mb-4')}>Order Summary</Text>
                    <DeliveryInfo>
                        <DeliveryInfo.Item info={order.deliveryAddress} title="Delivery Address" />
                        <DeliveryInfo.Item info={order.primaryContact} title="Who should receive this order" />
                        <DeliveryInfo.Item info={order.orderType === "PRE_ORDER" ? 'Pre-Order' : 'Instant Delivery'} title="Delivery Type" />
                        <DeliveryInfo.Item info={order.specialNote ?? ''} title="Delivery Instruction" />
                    </DeliveryInfo>
                </View>
            </View>

        </ScrollView>
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
