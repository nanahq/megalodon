import {Image, Pressable, ScrollView, Text, View} from "react-native";
import React, {useEffect, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {HeaderStyleInterpolators, StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import {tailwind} from "@tailwind";
import {OrderStatus} from "@nanahq/sticky";
import {Map} from "@screens/AppNavigator/Screens/orders/tracking/components/Map";
import {StatusBar} from "expo-status-bar";
import moment from "moment/moment";
import PrepareRestaurant from '@assets/app/restaurant-prepare.png'
import {DeliveryInfo} from "@screens/AppNavigator/Screens/orders/tracking/components/DeliveryInfo";

type TrackingProps = StackScreenProps<OrderParamsList, OrderScreenName.TRACK_ORDER>

const guideline =  {
        'ORDER_PLACED': 1,
        'COURIER_PICKUP': 2,
        'OUT_FOR_DELIVERY': 3,
        'DELIVERED_TO_CUSTOMER': 4,
    }
export const Tracking: React.FC<TrackingProps> = ({navigation, route}) => {

    // @ts-ignore
    const [activeStep] = useState(guideline[route.params.order.orderStatus as OrderStatus])
    // const [delivery,setDelivery] = useState()

    useEffect(() => {
        navigation.setOptions({
            headerShown: route.params.order.orderStatus !== OrderStatus.IN_ROUTE ,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl hidden'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
            headerRight: () => <HelpButton />,
            headerStyleInterpolator: HeaderStyleInterpolators.forFade
        })
    }, [])

    const text = () => {
        switch (route.params.order.orderStatus ) {
            case OrderStatus.PROCESSED:
            case OrderStatus.COURIER_PICKUP:
                return 'Preparing Your Order....'

            case OrderStatus.IN_ROUTE:
            case OrderStatus.COLLECTED:
                return 'Almost there....'

            default:
                return 'Enjoy Your Order'
        }
    }

    const getStatusBarStyle = () => {
        switch (route.params.order.orderStatus) {
            case OrderStatus.PROCESSED:
            case OrderStatus.COURIER_PICKUP:
                return '#00C2E8';

            case OrderStatus.IN_ROUTE:
            case OrderStatus.COLLECTED:
                return '#41a550'

            default:
                return 'dark-content';
        }
    };

    return (
        <View style={tailwind('flex-1')}>
            <StatusBar animated={true as any} style={"auto"  as any}  networkActivityIndicatorVisible={false} backgroundColor={getStatusBarStyle()} />
            {route.params.order.orderStatus !== OrderStatus.IN_ROUTE ? (
               <ScrollView style={tailwind('flex-1 bg-white pb-6')}>
                   <View style={tailwind('px-4')}>
                       <View style={tailwind('my-4')}>
                           <Text style={tailwind('text-2xl')}>{text()}</Text>
                           <Text style={tailwind('mt-2')}>Latest Arrival by {moment(route.params.order.orderDeliveryScheduledTime).format('HH:mm Do MMM')}</Text>
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
                   </View>
                   <View style={tailwind('mt-5 bg-brand-ash w-full flex flex-row items-center justify-center')}>
                       <Image source={PrepareRestaurant} style={{
                           width:280,
                           height:280,
                       }}  />
                   </View>
                   <View style={tailwind('px-4 mt-5')}>
                    <DeliveryInfo heading="Delivery Details">
                        <DeliveryInfo.Item info={route.params.order.deliveryAddress} title="Delivery Address" />
                        <DeliveryInfo.Item info={route.params.order.primaryContact} title="Who should receive this order" />
                        <DeliveryInfo.Item info={route.params.order.orderType === "PRE_ORDER" ? 'Pre-Order' : 'Instant Delivery'} title="Delivery Type" />
                        <DeliveryInfo.Item info={route.params.order.specialNote ?? ''} title="Delivery Instruction" />
                    </DeliveryInfo>
                   </View>
               </ScrollView>
            ) : <Map order={route.params.order} />}

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
