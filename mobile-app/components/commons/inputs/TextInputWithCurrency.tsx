import {forwardRef} from "react";
import {Text, TextInput, View} from "react-native";
import {tailwind} from "@tailwind";
import * as Device from "expo-device";
import {TextInputWithLabelProps} from "@components/commons/inputs/TextInputWithLabel";

export const NAIRA_UNICODE = '₦'

export const  TextInputWithCurrency =  forwardRef<any, TextInputWithLabelProps>(
    (props: TextInputWithLabelProps, ref): JSX.Element => {
        const {
            labelStyle,
            label,
            labelTestId,
            containerStyle,
            style,
            ...rest
        } = props
        return (
            <View style={[tailwind('flex flex-col'), containerStyle]}>
                <Text
                    testID={labelTestId}
                    style={[tailwind('mb-2.5 font-medium text-sm text-brand-black-500'), labelStyle]}>{
                    label}
                </Text>
                <View style={[tailwind('bg-brand-blue-200 w-full rounded-lg flex flex-row items-center h-12'), style]}>
                    <View style={tailwind('rounded-tl-lg  rounded-bl-lg h-full bg-brand-gray-700 px-4')}>
                        <Text style={tailwind('font-medium text-lg')}>{NAIRA_UNICODE}</Text>
                    </View>
                    <TextInput
                        ref={ref}
                        style={tailwind('bg-brand-blue-200 h-full font-medium text-lg text-brand-black-500', {
                            'text-base': Device.osName === 'iOS'
                        })}
                        {...rest}
                    />
                </View>
            </View>
        )
    }
)
