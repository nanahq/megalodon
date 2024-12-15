import {Dimensions, RefreshControl, View} from "react-native";
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
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {useLocation} from "@contexts/location.provider";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
import {useOrders} from "@contexts/orders.provider";
import {mutate} from "swr";

const {height} = Dimensions.get('screen')
export const OrderScreen: React.FC = () => {
    const isAndroid = Device.osName === 'Android'
    const navigation = useNavigation<NavigationProp<OrderParamsList>>()
    const [view, setView] = useState<OrderStatus>(OrderStatus.PAYMENT_PENDING)
    const analytics = useAnalytics()
    const {orders} = useOrders()

    const {isWithinSupportedCities} = useLocation()

    if(!isWithinSupportedCities) {
        return <NotfoundLocation />
    }

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Orders',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl font-bold  text-slate-900'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        })
    }, [])
    const ordersInProgress = useMemo(() => {
        if (orders?.length < 1) {
            return []
        }
        return orders?.filter(order => order.orderStatus !== OrderStatus.FULFILLED) ?? []
    }, [orders])


    const ordersDelivered = useMemo(() => {

        if (orders?.length < 1) {
            return []
        }
        return orders?.filter(order => order.orderStatus === OrderStatus.FULFILLED) ?? []
    }, [orders])


    useEffect(() => {
        void analytics.screen(OrderScreenName.ORDERS)
    }, [])


    const onPress = (order: OrderI) => {
        void analytics.track('CLICK:SINGLE-ORDER', {
            order: order._id,
            status: order.orderStatus
        })
        navigation.navigate(OrderScreenName.UNDELIVERED_SINGLE_ORDER as any, {
            order
        } as any)
    }

    function PendingRenderItem({item}: any) {
        return <OrderInProgressCard onPress={(order) => onPress(order)} order={item}/>

    }

    return (
        <View style={tailwind('flex-1 bg-white px-4')}>
            <View style={[tailwind('mt-2'), {
                height: "100%"
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

