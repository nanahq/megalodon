import {StyleSheet, View, Text} from "react-native";
import {CodeField, useBlurOnFulfill, useClearByFocusCell,} from "react-native-confirmation-code-field";
import {getColor, tailwind} from "@tailwind";

export interface PinTextInputItem {
    cellCount: number;
    testID: string;
    value: string;
    onChange: (text: string) => void;
    autofocus?: boolean;
}

export interface RenderCellItem {
    index: number;
    symbol: string;
    isFocused: boolean;
}

export function VerificationCodeInput({
                                   cellCount,
                                   testID,
                                   value,
                                   onChange,
                                   autofocus = true,
                               }: PinTextInputItem): JSX.Element {
    const ref = useBlurOnFulfill({value, cellCount});
    const [props, getCellOnLayoutHandler] = useClearByFocusCell({
        value,
        setValue: onChange,
    });

    const renderCell = ({index, symbol}: RenderCellItem): JSX.Element => {
        const hasValue = symbol !== undefined && symbol !== "";
        return (
            <View
                key={index}
                onLayout={getCellOnLayoutHandler(index)}
                style={[
                    styles.cell,
                    !hasValue && styles.borderColor,
                    hasValue && styles.borderColorFilled,
                    tailwind({
                        'bg-white': !hasValue,
                        'bg-black': hasValue
                    }),
                    index === 0 && {marginLeft: 0}
                ]}
                testID={`${testID}_${index}`}
            >
                {hasValue && (
                    <Text style={tailwind(' text-lg font-bold', {
                        'text-white': hasValue,
                        'text-black': !hasValue
                    })
                    }>
                        {symbol}
                    </Text>
                )}
            </View>
        );
    };

    return (
        <View style={tailwind("flex-row justify-center")}>
            <CodeField
                ref={ref}
                {...props}
                autoFocus={autofocus}
                cellCount={cellCount}
                keyboardType="number-pad"
                onChangeText={onChange}
                renderCell={renderCell}
                testID={testID}
                textContentType="oneTimeCode"
                value={value}
            />
        </View>
    );
}

const styles = StyleSheet.create({

    borderColor: {
        borderColor: getColor('gray-300'),
    },

    borderColorFilled: {
        borderColor: getColor('bg-black'),
    },
    cell: {
        alignItems: "center",
        backgroundColor: getColor('brand-gray-200'),
        borderRadius: 5,
        borderStyle: "solid",
        borderWidth: 1,
        color: getColor('brand-black-500'),
        display: "flex" ,
        fontSize: 20,
        fontWeight: "500",
        height: 50,
        justifyContent: "center",
        lineHeight: 20,
        marginLeft: 15,
        paddingLeft: 1,
        paddingTop: 1,
        textAlign: "center",
        width: 50,

    }
});
