import { forwardRef } from "react";

import { ScrollView } from "react-native";
import {tailwind} from "@tailwind";

interface ScrolledViewProps {
    testId: string
}

type Props = ScrollView["props"] & ScrolledViewProps

export const ScrolledView = forwardRef(
    (props: Props, ref: React.Ref<any>): JSX.Element => {
        const {style, ...rest} = props

        return (
            <ScrollView
                style={[tailwind('px-4'), style]}
                ref={ref}
                {...rest}
            />
        );
    }
);
