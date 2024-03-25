import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import moment from 'moment';
import {tailwind} from '@tailwind';

interface TimeSlot {
    start: string;
    end: string;
}

interface ScheduleItem {
    date: string;
    timeSlots: TimeSlot[];
}

interface Props {
    startTime: string;
    cutoffTime: string;
    startDate: string;
}

export const DeliverySchedule: React.FC<Props> = ({ startTime, cutoffTime, startDate }) => {
    const [selectedDate, setSelectedDate] = useState<string>(startDate);
    const [selectedTime, setSelectedTime] = useState<string>(startTime);
    const [schedule, setSchedule] = useState<ScheduleItem[]>([]);

    const generateSchedule = () => {
        const schedules: ScheduleItem[] = [];
        let currentDate = moment(startDate);

        while (currentDate.isSameOrBefore(moment(startDate).add(2, 'days'))) {
            schedules.push({
                date: currentDate.format('dddd'),
                timeSlots: generateTimeSlots(startTime, cutoffTime),
            });
            currentDate = currentDate.add(1, 'day');
        }

        setSchedule(schedules);
    };

    const generateTimeSlots = (start: string, end: string): TimeSlot[] => {
        const timeSlots: TimeSlot[] = [];
        const currentTime = moment(start);
        while (currentTime.isBefore(moment(end))) {
            timeSlots.push({
                start: currentTime.format('HH:mm'),
                end: currentTime.add(45, 'minutes').format('HH:mm'),
            });
        }
        return timeSlots;
    };

    useEffect(() => {
        generateSchedule();
    }, [startTime, cutoffTime, startDate]);

    const selectDate = (date: string) => {
        setSelectedDate(date);
    };

    const selectTime = (time: string) => {
        setSelectedTime(time);
    };

    return (
        <View style={tailwind('flex flex-col mt-10')}>
            <Text style={tailwind('text-black mb-2')}>Choose Delivery Time</Text>
            <View style={tailwind('flex-col items-center')}>
                <FlatList
                    data={schedule}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.date}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={tailwind('border-0.5 border-brand-gray-700 mx-2 ', selectedDate === item.date ? 'bg-primary-200 rounded-md p-2' : 'p-2')}
                            onPress={() => selectDate(item.date)}
                        >
                            <Text style={selectedDate === item.date ? tailwind('text-black') : tailwind('text-gray-500')}>
                                {item.date}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
                <FlatList
                    data={schedule.find((item) => item.date === selectedDate)?.timeSlots || []}
                    showsHorizontalScrollIndicator={false}
                    keyExtractor={(item) => item.start}
                    renderItem={({ item }) => (
                        <TouchableOpacity
                            style={selectedTime === item.start ? tailwind('bg-green-500 rounded-md p-2') : tailwind('bg-lightgray rounded-md p-2')}
                            onPress={() => selectTime(item.start)}
                        >
                            <Text style={selectedTime === item.start ? tailwind('text-white') : tailwind('text-gray-500')}>
                                {`${item.start}-${item.end}`}
                            </Text>
                        </TouchableOpacity>
                    )}
                />
            </View>
        </View>
    );
};
