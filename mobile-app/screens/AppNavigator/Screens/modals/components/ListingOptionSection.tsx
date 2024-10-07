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
                updatedOptions = prevSelectedOptions.map((op: any) => ({
                    ...op,
                    isSelected: op.name === name && value,
                }));
            } else {
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
                        <Text style={tailwind("text-nana-text font-bold")}>{option.name}</Text>
                        <Text style={tailwind("text-nana-text text-sm")}>{SelectedText()}</Text>
                    </View>
                    {isRequired && (
                        <View style={tailwind("bg-primary-100 border-0.5 border-primary-100 px-2 py-1 rounded-lg")}>
                            <Text style={tailwind("text-white text-xs")}>required</Text>
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
        <View style={tailwind("flex flex-row items-center justify-between py-2 border-b-0.5 border-gray-200")}>
            <View style={tailwind("flex flex-row items-center")}>
                <Checkbox style={[{padding: 5}, tailwind('border-1.5 border-primary-100', {'rounded-full': isRequired})]} color={isChecked ? getColor('primary-100') : undefined} value={isChecked} onValueChange={onValueChange} />
                <Text style={tailwind("ml-2.5 text-lg text-darkblue-50")}>{option.name}</Text>
            </View>
            {+option.price ? (
                <NumberFormat
                    prefix="+ ₦"
                    value={option.price}
                    thousandSeparator
                    displayType="text"
                    renderText={(value) => (
                        <Text style={tailwind("text-sm text-gray-400")}>{value}</Text>
                    )}
                />
            ):  <Text style={tailwind("text-sm text-brand-black-500")}>Free</Text>}
        </View>
    );
};

