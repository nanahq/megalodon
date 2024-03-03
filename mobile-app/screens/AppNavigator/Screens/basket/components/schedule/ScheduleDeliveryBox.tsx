import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";

const _ScheduleDeliveryBox: React.FC<{selectedDate: {time: string, date: string} | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-black mb-2')}>Schedule Time</Text>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-brand-ash py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <IconComponent iconType="MaterialIcons" name="date-range" style={tailwind('text-black')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('capitalize')}>{props.selectedDate === undefined ? 'Choose delivery date and time' : `${props.selectedDate.time} - ${props.selectedDate.date}`}</Text>
                    </View>
                    <IconComponent iconType="Feather" name="chevron-right" size={20} style={tailwind('text-gray-500')} />
                </View>
            </Pressable>
        </View>
    )
}

export const ScheduleDeliveryBox = memo(_ScheduleDeliveryBox)
