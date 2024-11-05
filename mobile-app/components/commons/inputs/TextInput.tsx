import { KeyboardType, StyleProp, TextInput, TextInputProps, View, ViewProps, Text } from 'react-native';
import { tailwind } from '@tailwind';

interface TextAreaProps extends TextInputProps {
    style?: StyleProp<TextInputProps>;
    testID: string;
    onChangeText: (e: any) => void;
    initialText: string;
    placeholder?: string;
    placeHolderStyle?: string;
    containerStyle?: StyleProp<ViewProps>;
    keyboardPad?: KeyboardType;
    textAlign?: any;
    label?: string
}

export function GenericTextInput(props: TextAreaProps): JSX.Element {
    const {
        placeHolderStyle,
        containerStyle,
        keyboardPad = 'default',
        style,
        ...otherProps
    } = props;

    return (
        <View style={containerStyle as any}>
            <View style={tailwind('flex-col ')}>
                <TextInput
                    keyboardType={keyboardPad}
                    style={[tailwind('py-4 w-full px-3 flex items-center  rounded  text-xl text-black'),  { textAlignVertical: 'center' }, style]}
                    placeholderTextColor={placeHolderStyle}
                    defaultValue={props.initialText}
                    {...otherProps}
                />
            </View>
        </View>
    );
}


interface TextAreaPropsV2 extends TextInputProps {
    style?: StyleProp<TextInputProps>;
    testID: string;
    onChangeText: (e: any) => void;
    initialText: string;
    placeholder?: string;
    placeHolderStyle?: string;
    containerStyle?: StyleProp<ViewProps>;
    keyboardPad?: KeyboardType;
    textAlign?: any;
    label?: string
    labelStyle?: string
    moreInfo?: string
}

export function GenericTextInputV2(props: TextAreaPropsV2): JSX.Element {
    const {
        placeHolderStyle,
        containerStyle,
        keyboardPad = 'default',
        style,
        label,
        initialText,
        labelStyle,
        moreInfo,
        ...otherProps
    } = props;

    return (
        <View style={containerStyle as any}>
            <View style={tailwind('flex-col ')}>
                {label !== undefined && (
                    <View style={tailwind('flex flex-col mb-2.5 w-full ')}>
                        <Text
                            style={tailwind('font-medium text-sm text-brand-black-500')}>
                            {label}
                        </Text>
                        {moreInfo !== undefined && (
                            <Text
                                style={tailwind('font-normal text-xs text-slate-600')}>
                                {moreInfo}
                            </Text>
                        )}
                    </View>
                )}
                <TextInput
                    keyboardType={keyboardPad}
                    style={[tailwind('w-full p-0 m-0 px-3 flex items-center bg-primary-200 rounded text-xl text-black'),  {
                        textAlignVertical: 'center' ,
                        height: 60,
                        lineHeight: 15
                    }, style]}
                    placeholderTextColor={placeHolderStyle}
                    defaultValue={initialText}
                    {...otherProps}
                />
            </View>
        </View>
    );
}
