import { Text, View } from "react-native";
import { tailwind } from "@tailwind";
import React from "react";
import { DeliveryI, OrderStatus } from "@nanahq/sticky";
import { IconComponent } from "@components/commons/IconComponent";

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
        text: 'Vendor preparing your order',
        icon: {
            name: 'flame-outline',
            type: "Ionicons"
        },
        status: [OrderStatus.PROCESSED, OrderStatus.ACCEPTED]
    },
    {
        index: 2,
        text: 'Picking up order from vendor',
        icon: {
            name: 'package',
            type: "Feather"
        },
        status: [OrderStatus.COURIER_PICKUP, OrderStatus.COLLECTED]
    },
    {
        index: 3,
        text: 'Delivery in progress',
        icon: {
            name: 'truck',
            type: "Feather"
        },
        status: [OrderStatus.IN_ROUTE]
    },
    {
        index: 4,
        text: 'Order delivered',
        icon: {
            name: 'checkcircle',
            type: "AntDesign"
        },
        status: [OrderStatus.FULFILLED]
    }
]

export const OrderStatusStepper: React.FC<{ delivery: DeliveryI }> = ({ delivery }) => {
    return (
        <View style={tailwind("px-4 mt-10")}>
            <Text style={tailwind('font-bold text-lg mb-4')}>Delivery Progress</Text>
            {statuses.map(({ icon, text, status, index, }: any, i) => {
                const currentStatus = step[delivery.status as any]
                return (
                    <View
                        key={index}
                        style={tailwind("relative pb-8 flex flex-row items-center")}
                    >

                        <View
                            style={[
                                tailwind("border-2 border-transparent rounded-full flex justify-center items-center mr-3 text-sm w-10 h-10"),
                                status.includes(delivery.status) || currentStatus > index ? tailwind("bg-primary-500") : tailwind("bg-gray-300"),

                            ]}
                        >
                            <IconComponent iconType={icon?.type} name={icon?.name} size={20} color="#ffffff" />
                        </View>
                        <View style={tailwind("flex-1")}>
                            <Text style={[tailwind("text-lg"), status.includes(delivery.status)  || currentStatus > index ? tailwind("text-primary-500") : tailwind("text-gray-300")]}>
                                {text}
                            </Text>
                        </View>
                        {i < statuses.length - 1 && (
                            <View
                                style={[
                                    tailwind("w-0.5 absolute left-5 -bottom-10"),
                                    {height: 70},
                                    status.includes(delivery.status)  || currentStatus > index ? tailwind("bg-primary-500") : tailwind("bg-gray-300")
                                ]}
                            />
                        )}
                    </View>
                )
            })}
        </View>
    )
}
