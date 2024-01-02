import React, {memo, useEffect, useState} from "react";
import { ListingOption, ListingOptionGroupI } from "@nanahq/sticky";
import { View, Text } from "react-native";
import {getColor, tailwind} from "@tailwind";
import Checkbox from "expo-checkbox";
import { NumericFormat as NumberFormat } from "react-number-format";

const _ListingOptionSection: React.FC<{
    option: ListingOptionGroupI,
    onSelectedOptionsChange: (selectedOptions: {name: string, price: string, isSelected: boolean }[]) => void;
}> = ({ option, onSelectedOptionsChange }) => {
    const [selectedOptions, setSelectedOptions] = useState<any>(
        option.options.map((op) => ({ ...op, isSelected: false }))
    );

    const isRequired = Boolean(option.min > 0);
    const isSingleSelection = isRequired && option.min === 1;

    const onValueChange = (name: string, value: boolean) => {
        setSelectedOptions((prevSelectedOptions: any) => {
            let updatedOptions: ListingOption[] = [];

            if (isSingleSelection && value) {
                // If it's a required single selection, unselect all other options in the section
                updatedOptions = prevSelectedOptions.map((op: any) => ({
                    ...op,
                    isSelected: op.name === name && value,
                }));
            } else {
                // Otherwise, toggle the selected option
                updatedOptions = prevSelectedOptions.map((op: any) =>
                    op.name === name ? { ...op, isSelected: value } : op
                );
            }

            return updatedOptions;
        });
    };

    useEffect(() => {
        onSelectedOptionsChange(selectedOptions);
    }, [selectedOptions]);

    const SelectedText = () => {
        if (isSingleSelection) {
            return 'Select only 1 option';
        } else if (isRequired) {
            return `Select up to ${option.max} option(s)`;
        }
        return '';
    };

    return (
        <View style={tailwind("bg-white py-4 mt-3")}>
            <View style={tailwind("flex flex-col px-4")}>
                <View style={tailwind("flex flex-row items-center w-full justify-between")}>
                    <View>
                        <Text style={tailwind(" text-2xl")}>{option.name}</Text>
                        <Text style={tailwind("text-brand-gray-700 text-sm")}>{SelectedText()}</Text>
                    </View>
                    {isRequired && (
                        <View style={tailwind("bg-brand-gray-500 border-0.5 border-brand-gray-700 p-1 rounded-5")}>
                            <Text style={tailwind("text-black text-sm")}>Required</Text>
                        </View>
                    )}
                </View>
                <View>
                    {option.options.map((op, index) => (
                        <CheckBoxes
                            isRequired={isSingleSelection}
                            key={index}
                            option={op}
                            isChecked={selectedOptions.some((selectedOp: any) => selectedOp.name === op.name && selectedOp.isSelected)}
                            onValueChange={(value) => onValueChange(op.name, value)}
                        />
                    ))}
                </View>
            </View>
        </View>
    );
};

export const ListingOptionSection = memo(_ListingOptionSection);


const CheckBoxes: React.FC<{
    isChecked: boolean;
    onValueChange: (value: boolean) => void;
    option: ListingOption;
    isRequired: boolean
}> = ({ option, onValueChange, isChecked, isRequired }) => {
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
            <Checkbox style={[{margin: 8}, tailwind({'rounded-full': isRequired})]} color={isChecked ? getColor('brand-black-500') : undefined} value={isChecked} onValueChange={onValueChange} />
        </View>
    );
};

