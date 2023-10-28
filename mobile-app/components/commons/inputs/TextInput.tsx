import { KeyboardType, StyleProp, TextInput, TextInputProps, View, ViewProps } from 'react-native';
import { tailwind } from '@tailwind';

interface TextAreaProps {
    style?: StyleProp<TextInputProps>;
    testID: string;
    onChangeText: (e: any) => void;
    initialText: string;
    placeholder: string;
    placeHolderStyle?: string;
    containerStyle?: StyleProp<ViewProps>;
    keyboardPad?: KeyboardType;
    textAlign?: any;
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
            <View style={tailwind('flex-row items-center')}>
                <TextInput
                    keyboardType={keyboardPad}
                    style={[tailwind('py-4 w-full px-3 flex items-center bg-primary-200 rounded  text-xl text-black'), style]}
                    placeholderTextColor={placeHolderStyle}
                    {...otherProps}
                />
            </View>
        </View>
    );
}
