import {Dimensions, View} from "react-native";
import React, {useEffect, useMemo, useState} from "react";
import {OrderI, OrderStatus} from "@nanahq/sticky";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {_api} from "@api/_request";
import {showTost} from "@components/commons/Toast";
import {useToast} from "react-native-toast-notifications";
import {tailwind} from "@tailwind";
import {OrderView} from "@screens/AppNavigator/Screens/orders/components/OrderView";
import {FlashList} from "@shopify/flash-list";
import {OrderInProgressCard} from "@screens/AppNavigator/Screens/orders/components/OrderCards";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import * as Device from 'expo-device'
import {useAnalytics} from "@segment/analytics-react-native";

const {height} = Dimensions.get('screen')
export const OrderScreen: React.FC = () => {
    const isAndroid = Device.osName === 'Android'
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()
    const [fetchingOrders, setFetchingOrders] = useState<boolean>(true)
    const [orders, setOrders] = useState<OrderI[]>([])
    const [view, setView] = useState<OrderStatus>(OrderStatus.PAYMENT_PENDING)
    const analytics = useAnalytics()

    const ordersInProgress = useMemo(() => {
        if (orders.length < 1) {
            return []
        }
        return orders.filter(order => order.orderStatus !== OrderStatus.FULFILLED)
    }, [orders, fetchingOrders])


    const ordersDelivered = useMemo(() => {

        if (orders.length < 1) {
            return []
        }
        return orders.filter(order => order.orderStatus === OrderStatus.FULFILLED)
    }, [orders, fetchingOrders])

    const toast  = useToast()

    useEffect(() => {
       async function fetchOrder (): Promise<void> {
           try {
               const data = (await  _api.requestData({
                   method: 'get',
                   url: 'order/orders'
               })).data as OrderI[]

               setOrders(data)
           } catch (error) {
               showTost(toast, 'Can not fetch orders now', 'error')
           } finally {
               setFetchingOrders(false)
           }
       }

       if (fetchingOrders) {
           void fetchOrder()
       }
    }, [fetchingOrders])


    useEffect(() => {
        void analytics.screen(OrderScreenName.ORDERS)
    }, [])
    if (fetchingOrders) {
        return <LoaderComponentScreen />
    }


    const onPress = (order: OrderI) => {
        void analytics.track('CLICK:SINGLE-ORDER', {
            order: order._id,
            status: order.orderStatus
        })
        navigation.navigate(OrderScreenName.UNDELIVERED_SINGLE_ORDER, {
            order
        })
    }

    function PendingRenderItem({item}: any) {
        return <OrderInProgressCard onPress={(order) => onPress(order)} order={item}/>

    }

    return (
        <View style={tailwind('flex-1 bg-white px-4')}>
            <View style={[tailwind('mt-4 pb-20'), {
                height: height - 150
            }]}>
                <OrderView view={view} onButtonClick={(v) => setView(v as any)} />
                {view === 'PAYMENT_PENDING' ? (
                    <FlashList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={tailwind(' bg-white', {'pb-20': isAndroid} )}
                        data={ordersInProgress}
                        renderItem={(props) => <PendingRenderItem {...props} />}
                        keyExtractor={item => item._id}
                        estimatedItemSize={10}
                    />
                ) : (
                    <FlashList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={tailwind(' bg-white', {'pb-20': isAndroid})}
                        data={ordersDelivered}
                        renderItem={(props) => <PendingRenderItem {...props} />}
                        keyExtractor={item => item._id}
                        estimatedItemSize={10}
                    />
                )}
            </View>
        </View>
    )
}

