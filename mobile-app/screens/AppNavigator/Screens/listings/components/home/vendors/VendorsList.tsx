import {VendorsCard} from "@screens/AppNavigator/Screens/listings/components/home/vendors/VendorsCard";
import {useCallback, useRef} from 'react';
import {tailwind} from "@tailwind";
import {FlashListComponent} from "@components/views/FlashList";

const data = [ {id: 1}, {id: 2}, {id: 3}, {id: 4}, {id: 5}, {id: 6}]
export function VendorsList (): JSX.Element {
    const ref = useRef(null);
    const RenderItems = useCallback(
        (): JSX.Element => {
            return (
                <VendorsCard
                 fullWidth
                />
            );
        },
        []
    );
    return (
        <FlashListComponent
            contentContainerStyle={tailwind("pb-10")}
            data={data}
            ref={ref}
            estimatedItemSize={7}
            keyExtractor={(item) => item.id}
            testID="VendorsList.List"
            renderItem={RenderItems}
        />
    )
}
