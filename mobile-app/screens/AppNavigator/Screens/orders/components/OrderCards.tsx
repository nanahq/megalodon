import React, {memo, useMemo} from "react";
import {Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import moment from "moment";
import {IconComponent} from "@components/commons/IconComponent";
import {MappedDeliveryStatus} from "@constants/MappedDeliveryStatus";
import {OrderStatus} from "@nanahq/sticky";
import {ChevronRight} from "lucide-react-native";

const _OrderInProgressCard: React.FC<{order: any, onPress: (id: any) => void}> = ({order, onPress}) => {
    const orderDate = moment(order.createdAt).format('dddd Do MMM YYYY')
     const listingName = useMemo(() => {
        return order.listing.map((li: any) => li.name).join(',')
    }, [order._id])

    return (
        <Pressable onPress={() => onPress(order)} style={tailwind('border-b-0.5 border-slate-200 py-4 flex flex-row items-center w-full')}>
            <View style={tailwind('flex flex-row w-full  items-center justify-between')}>
                <View>
                    <Text numberOfLines={1} ellipsizeMode="tail" style={[tailwind('overflow-hidden text-base font-normal mb-1'), {width: 200}]}>
                        {listingName}
                    </Text>
                    <Text style={tailwind('text-slate-500 font-normal text-sm')}>{orderDate}</Text>
                </View>
                <View style={tailwind('flex flex-row items-center')}>
                    <Text style={tailwind('text-slate-900 font-normal text-base', {'text-green-600': order.orderStatus === OrderStatus.IN_ROUTE, 'text-primary-100': order.orderStatus === OrderStatus.FULFILLED})}>{MappedDeliveryStatus[order.orderStatus as OrderStatus]}</Text>
                </View>
            </View>
        </Pressable>
    )
}

export const OrderInProgressCard = memo(_OrderInProgressCard)
