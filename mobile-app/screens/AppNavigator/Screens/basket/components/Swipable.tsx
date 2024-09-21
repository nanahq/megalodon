import {Swipeable} from "react-native-gesture-handler";
import {PropsWithChildren} from "react";


export const CartSwipeable: React.FC<PropsWithChildren<{deleteCartItem: () => void, renderRightActions: any}>> = (props) => {
    return (
        <Swipeable
            renderRightActions={props.renderRightActions}
            onSwipeableOpen={() => {
                props.deleteCartItem()
            }}
        >
            {props.children}
        </Swipeable>
    )
}
