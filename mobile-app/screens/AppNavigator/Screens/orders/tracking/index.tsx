import {Pressable, ScrollView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {HeaderStyleInterpolators, StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import {tailwind} from "@tailwind";
import {DeliveryI, OrderI, OrderStatus, SOCKET_MESSAGE} from "@nanahq/sticky";
import {Map} from "@screens/AppNavigator/Screens/orders/tracking/components/Map";
import {StatusBar} from "expo-status-bar";
import {useAnalytics} from "@segment/analytics-react-native";
import {_api, getSocketUrl} from "@api/_request";
import {OrderStatusStepper} from "@screens/AppNavigator/Screens/orders/tracking/components/stepper";
import {useLoading} from "@contexts/loading.provider";
import {Phone} from "lucide-react-native";
import {socket} from "../../../../../App";

type TrackingProps = StackScreenProps<OrderParamsList, OrderScreenName.TRACK_ORDER>

export const Tracking: React.FC<TrackingProps> = ({navigation, route}) => {
    const {setLoadingState} = useLoading()
    const [delivery, setDelivery] = useState<DeliveryI | undefined>(undefined)
    const [deliveryStatus, setDeliveryStatus] = useState(delivery?.status ?? OrderStatus.PROCESSED)
    const analytics = useAnalytics()

    const [order, setOrder] = useState<OrderI>(route.params.order)

    useEffect(() => {
        void analytics.screen(OrderScreenName.TRACK_ORDER)
        if (socket.connected) {
            socket?.on(SOCKET_MESSAGE.UPDATE_ORDER_STATUS, (message: {userId: string, orderId: string, status: OrderStatus, driver: string, vendorName?: string}) => {
               const isOrder = message.orderId === route.params.order._id
               if (isOrder) {
                   setOrder(prev => ({...prev, orderStatus: message.status}))
                   switch (message.status) {
                       case OrderStatus.FULFILLED:
                           setDeliveryStatus(message.status)
                           navigation.setOptions({
                               headerShown: true,
                           })
                           break;
                       default:
                           setDeliveryStatus(message.status)
                   }
               }
           })
        }
    }, [socket.connected])

    useEffect(() => {
        navigation.setOptions({
            headerShown: false,
            headerStyleInterpolator: HeaderStyleInterpolators.forFade
        })
    }, [order.orderStatus])

    useEffect(() => {
        const fetchDeliveryInformation = async (): Promise<void> => {
            try {
                setLoadingState(true)
                const information = (await _api.requestData({
                    method: 'GET',
                    url: `delivery/order/${route.params.order._id}`,
                })).data as DeliveryI | undefined;

               if (information?._id !== undefined) {
                   setDelivery(() => information);
                   setDeliveryStatus(information?.status as any)
               }
                // eslint-disable-next-line no-useless-catch
            } catch (error) {
                throw error
            } finally {
                setLoadingState(false);
            }
        };

        void fetchDeliveryInformation();

    }, []);

    return (
        <ScrollView style={tailwind('flex-1 bg-white relative')}>
            {order.orderStatus !== OrderStatus.FULFILLED && (
                <StatusBar animated={true as any} style={"auto"  as any}  networkActivityIndicatorVisible={false} backgroundColor={order.orderStatus === OrderStatus.IN_ROUTE ? '#00C2E8': '#41a550'} />
            )}
            {delivery !== undefined && <Map delivery={delivery} order={order} />}
            {delivery !== undefined && (
                <OrderStatusStepper _status={deliveryStatus}  order={order} />
            )}
            {delivery !== undefined && delivery.assignedToDriver && (
                <View style={tailwind('px-4 mt-10 rounded-t-xl')}>
                    <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                        <View style={tailwind('flex flex-col')}>
                            <View style={tailwind('flex flex-row items-center')}>
                                <Text style={tailwind('font-medium text-lg text-slate-900 mb-0.5 mr-2')}>Driver</Text>
                                <Text style={tailwind('text-base text-slate-900 font-normal mb-0.5')}>{`${delivery.driver.firstName} ${delivery.driver.lastName}`}</Text>
                            </View>
                        </View>
                        <Pressable style={[tailwind('bg-primary-100 flex flex-row items-center justify-center rounded-full'), {width: 40, height: 40}]}>
                            <Phone size={20} style={tailwind('text-white')}/>
                        </Pressable>
                    </View>
                </View>
            ) }
            <ModalCloseIcon size={18} iconStyle={tailwind('p-0 m-0')} buttonStyle={tailwind('absolute top-16 left-2 p-2.5 bg-slate-100 rounded-full')} onPress={() => navigation.goBack()} />
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
