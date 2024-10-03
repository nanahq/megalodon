import { Text, View } from "react-native";
import { tailwind } from "@tailwind";
import React from "react";
import {OrderI, OrderStatus} from "@nanahq/sticky";
import {Check, CookingPot, ThumbsUp, Truck} from "lucide-react-native";
import moment from "moment/moment";

const step: Record<any, any> = {
    [OrderStatus.PROCESSED]: 1,
    [OrderStatus.ACCEPTED]: 1,
    [OrderStatus.COURIER_PICKUP]: 2,
    [OrderStatus.COLLECTED]: 2,
    [OrderStatus.IN_ROUTE]: 3,
    [OrderStatus.FULFILLED]: 4,
}

const statuses = [
    {
        index: 1,
        text: 'Cooking',
        icon: () => <CookingPot size={20} color="#ffffff" />,
        status: [OrderStatus.PROCESSED, OrderStatus.ACCEPTED]
    },
    {
        index: 2,
        text: 'Pickup',
        icon: () => <ThumbsUp size={20} color="#ffffff" /> ,
        status: [OrderStatus.COURIER_PICKUP, OrderStatus.COLLECTED]
    },
    {
        index: 3,
        text: 'Driving',
        icon: () => <Truck size={20} color="#ffffff" /> ,
        status: [OrderStatus.IN_ROUTE]
    },
    {
        index: 4,
        text: 'Delivered',
        icon: () => <Check size={20} color="#ffffff" /> ,
        status: [OrderStatus.FULFILLED]
    }
]

export const OrderStatusStepper: React.FC<{ _status: OrderStatus, order: OrderI }> = ({ order,  _status }) => {
    return (
        <View style={tailwind("px-4 mt-3")}>
            <Text style={tailwind('text-xl  font-bold mb-2')}>Headed your way</Text>
            <View style={tailwind('flex mb-8 flex-row items-center justify-between')}>
                <Text style={tailwind('text-gray-400')}>Arriving at: <Text style={tailwind('text-black')}>{moment(order.orderDeliveryScheduledTime).format('HH:mm Do MMM') }</Text></Text>
                <Text>Pin: 4501</Text>
            </View>
            <View style={tailwind('flex flex-row items-center justify-between')}>
            {statuses.map(({ icon, text, status, index, }: any, i) => {
                const currentStatus = step[_status as any]
                return (
                    <View
                        key={index}
                        style={tailwind("relative flex flex-col justify-center items-center")}
                    >

                        <View
                            style={[
                                tailwind("border-2 border-transparent rounded-full flex justify-center items-center mr-3 text-sm w-10 h-10"),
                                status.includes(_status) || currentStatus > index ? tailwind("bg-primary-100") : tailwind("bg-gray-300"),

                            ]}
                        >
                            {icon()}
                        </View>
                        <View style={tailwind("")}>
                            <Text style={[tailwind("text-sm text-center"), status.includes(_status)  || currentStatus > index ? tailwind("text-primary-100") : tailwind("text-gray-300")]}>
                                {text}
                            </Text>
                        </View>
                        {i < statuses.length - 1 && (
                            <View
                                style={[
                                    tailwind("h-0.5 absolute -right-10"),
                                    {width: 50},
                                    status.includes(_status)  || currentStatus > index ? tailwind("bg-primary-100") : tailwind("bg-gray-300")
                                ]}
                            />
                        )}
                    </View>
                )
            })}
        </View>
        </View>
    )
}
