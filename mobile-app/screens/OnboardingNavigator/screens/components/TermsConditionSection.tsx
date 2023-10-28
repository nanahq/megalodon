import {tailwind} from "@tailwind";
import {Text} from "react-native";

export function TermsConditionRow (props: {testID: string}): JSX.Element {
    return (
        <Text {...props}  style={tailwind('text-sm text-brand-gray-700 mb-1')}>
            By proceeding, you consent to get calls, WhatsApp or SMS messages, including by automated means, from Nana and its affiliates to the number provided.
        </Text>
    )
}
