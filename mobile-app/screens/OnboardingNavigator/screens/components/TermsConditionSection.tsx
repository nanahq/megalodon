import {tailwind} from "@tailwind";
import {Text} from "react-native";

export function TermsConditionRow (props: {testID: string}): JSX.Element {
    return (
        <Text {...props}  style={tailwind('text-xs text-center text-gray-300 mb-3')}>
            By proceeding, Terms and conditions will apply
        </Text>
    )
}
