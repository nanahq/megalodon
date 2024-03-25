import { forwardRef } from "react";

import {FlatList} from "react-native";


type ThemedFlatListProps = FlatList["props"]


export const FlatListComponent = forwardRef(
    (props: ThemedFlatListProps, ref: React.Ref<any>): JSX.Element => {
        const {style, ...otherProps} = props
        return (
            <FlatList
                style={style}
                ref={ref}
                {...otherProps}
            />
        );
    }
);
