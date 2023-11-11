import React, {memo, useEffect, useState} from "react";
import { ListingOption, ListingOptionGroupI } from "@nanahq/sticky";
import { View, Text } from "react-native";
import {getColor, tailwind} from "@tailwind";
import Checkbox from "expo-checkbox";
import { NumericFormat as NumberFormat } from "react-number-format";

const _ListingOptionSection: React.FC<{
    option: ListingOptionGroupI,
    onSelectedOptionsChange: (selectedOptions: {name: string, price: string}[]) => void;
}> = ({ option, onSelectedOptionsChange }) => {
    const [selectedOptions, setSelectedOptions] = useState<{ [name: string]: boolean }>(
        Object.fromEntries(option.options.map((op) => [op.name, false]))
    );

    const isRequired = Boolean(option.min);
    const onValueChange = (name: string, value: boolean,) => {
        setSelectedOptions((prevSelectedOptions) => ({
            ...prevSelectedOptions,
            [name]: value,
        }));

    };

    useEffect(() => {
        const selectedOptionsList = Object.keys(selectedOptions)
            .filter((name) => selectedOptions[name])
            .map((name) => ({ name, price: option.options.find((op) => op.name === name)!.price }));

        onSelectedOptionsChange(selectedOptionsList);
    }, [selectedOptions]);

    const SelectedText = () => {
        if (option.max <= 1 && option.min > 0) {
            return 'Select only 1 option'
        } else if (option.min < 1 && option.max > 0) {
            return `Select up to ${option.max} option(s)`
        }
    }

    return (
        <View style={tailwind("bg-white py-4 mt-3")}>
            <View style={tailwind("flex flex-col px-4")}>
                <View style={tailwind("flex flex-row items-center w-full justify-between")}>
                    <View>
                        <Text style={tailwind("font-bold text-xl")}>{option.name}</Text>
                        <Text style={tailwind("text-brand-gray-700 text-sm")}>{SelectedText()}</Text>
                    </View>
                    {isRequired && (
                        <View style={tailwind("bg-brand-gray-700 p-1 rounded-5")}>
                            <Text style={tailwind("text-black")}>Required</Text>
                        </View>
                    )}
                </View>
                <View>
                    {option.options.map((op, index) => (
                        <CheckBoxes
                            isChecked={selectedOptions[op.name]}
                            key={index}
                            option={op}
                            onValueChange={(value) => onValueChange(op.name, value,)}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

const CheckBoxes: React.FC<{
    isChecked: boolean;
    onValueChange: (value: boolean) => void;
    option: ListingOption;
}> = ({ option, onValueChange, isChecked }) => {
    return (
        <View style={tailwind("flex flex-row items-center justify-between py-5")}>
            <View style={tailwind("flex flex-col")}>
                <Text style={tailwind(" text-lg text-brand-black-500")}>{option.name}</Text>
                {+option.price ? (
                    <NumberFormat
                        prefix="+ ₦"
                        value={option.price}
                        thousandSeparator
                        displayType="text"
                        renderText={(value) => (
                            <Text style={tailwind("text-sm text-brand-black-500")}>{value}</Text>
                        )}
                    />
                ):  <Text style={tailwind("text-sm text-brand-black-500")}>Free</Text>}
            </View>
            <Checkbox style={{margin: 8}} color={isChecked ? getColor('brand-black-500') : undefined} value={isChecked} onValueChange={onValueChange} />
        </View>
    );
};

export const ListingOptionSection = memo(_ListingOptionSection);
