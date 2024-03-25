import {StyleProp, Text, TextInput, TextInputProps, View} from 'react-native'
import {getColor, tailwind} from "@tailwind";
import {PropsWithChildren, useState} from 'react'
import * as Device from 'expo-device'
import {Control, Controller} from 'react-hook-form'
import {RegisterOptions} from "react-hook-form/dist/types/validator";

export interface ControlledTextInputWithLabelProps extends TextInputProps {
    labelStyle?: StyleProp<TextInputProps>
    containerStyle?: StyleProp<any>
    label: string
    labelTestId: string
    moreInfo?: string,
    control: Control<any, any>
    name: string
    register?: any
    error?: boolean
    errorMessage?: string
    rules?: Omit<RegisterOptions<any, any>, 'valueAsNumber' | 'valueAsDate' | 'setValueAs' | 'disabled'>
}

export function ControlledTextInputWithLabel(props: ControlledTextInputWithLabelProps): JSX.Element {
    const {
        moreInfo,
        labelStyle,
        label,
        labelTestId,
        containerStyle,
        style,
        control,
        name,
        register,
        rules,
        error,
        errorMessage,
        ...rest
    } = props

    const [inputFocus, setInputFocus] = useState<boolean>(false)
    return (
      <Controller
          rules={rules}
          name={name}
        control={control}
        render={({field}) => (
            <View style={[tailwind('flex flex-col'), containerStyle]}>
                <View style={tailwind('flex flex-col mb-2.5 w-full ')}>
                    <Text
                        testID={labelTestId}
                        style={[tailwind('font-medium text-sm text-brand-black-500', {
                            'text-primary-500 font-bold': inputFocus
                        }), labelStyle]}>
                        {label}
                    </Text>
                    {moreInfo !== undefined && (
                        <Text
                            testID={labelTestId}
                            style={[tailwind('font-normal text-xs text-brand-gray-700'), labelStyle]}>
                            {moreInfo}
                        </Text>
                    )}
                </View>
                <TextInput
                    {...register}
                    {...rest}
                    value={field.value}
                    onChangeText={field.onChange}
                    returnKeyType='done'
                    onFocus={() => setInputFocus(true)}
                    onBlur={() => setInputFocus(false)}
                    placeholderTextColor={getColor('brand-gray-800')}
                    style={[tailwind('rounded-lg bg-primary-200 flex lowercase flex-row items-center justify-center w-full p-3 text-xs font-medium text-black', {
                        'text-sm': Device.osName === 'iOS',
                        'border-0.5 border-primary-500': inputFocus
                    }), {
                        height: 50,
                        lineHeight:15
                    }, style]}
                />
                {error && errorMessage !== undefined && <FieldErrorText>{errorMessage}</FieldErrorText>}
            </View>
        )}
      />
    )
}


function FieldErrorText (props: PropsWithChildren<{}>): JSX.Element {
    return (
        <Text style={tailwind('text-xs text-red-500')}>
            {props.children}
        </Text>
    )
}
