import React, {useState} from 'react'
import {View, Text, TextInput} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {Search} from "lucide-react-native";

interface SearchBarProps {

}

export const SearchBar: React.FC<SearchBarProps> = (props) => {
    const [textFocus, setTextFocus] = useState(false)
    return (
        <View style={tailwind('mt-5')}>
            <View style={tailwind('flex flex-row items-center border-1.5 border-gray-200 bg-white rounded-3xl px-3 py-2.5', {
                'border-slate-600': textFocus
            })}>
                <Search size={24} color={getColor('slate-600')} />
                <TextInput
                    onFocus={() => setTextFocus(true)}
                    onBlur={() => setTextFocus(false)}
                    onPressOut={() => setTextFocus(false)}
                    style={tailwind('text-sm ml-2 font-light')}
                    placeholderTextColor={getColor('slate-600')}
                    placeholder="Search for food, groceries, mart etc"
                />
            </View>
        </View>
    )
}
