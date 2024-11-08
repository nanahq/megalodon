import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {CalendarDays, ChevronRight} from "lucide-react-native";

const _ScheduleDeliveryBox: React.FC<{selectedDate: {time: string, date: string} | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-base text-slate-900 font-normal mb-2')}>What time do you want your order?
                <Text style={tailwind('text-xs font-normal text-slate-500')}>   *required</Text>
            </Text>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-slate-200 py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <CalendarDays style={tailwind('text-primary-100')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('font-normal text-base')}>{props.selectedDate === undefined ? 'Choose delivery date and time' : `${props.selectedDate.time} - ${props.selectedDate.date}`}</Text>
                    </View>
                    <ChevronRight  size={20} style={tailwind('text-gray-500')} />
                </View>
            </Pressable>
        </View>
    )
}

export const ScheduleDeliveryBox = memo(_ScheduleDeliveryBox)
