import {View} from "react-native";
import {tailwind} from "@tailwind";
import {VendorCategoriesItem, VendorLocationInformation} from "./Loaders";

interface SkeletonLoaderProp {
    row: number;
    screen: SkeletonLoaderScreen;
}

export enum SkeletonLoaderScreen {
    "VendorDistanceLoader" = "VendorDistanceLoader",
    "VendorScreen" = "VendorScreen",

}


export function SkeletonLoader (props: SkeletonLoaderProp): JSX.Element {
    const skeletonRow = Array(props.row).fill(props.row);
    switch (props.screen) {
        case SkeletonLoaderScreen.VendorDistanceLoader:
            return (
                <>
                    {skeletonRow.map((_, index) => (
                        <VendorLocationInformation key={index}/>
                    ))}
                </>
            )
        case SkeletonLoaderScreen.VendorScreen:
            return (
                <>

                    {skeletonRow.map(i => (
                          <View style={tailwind('my-2')}>
                              <VendorCategoriesItem key={i}/>
                          </View>
                    ))}
                </>
            )
        default:
        return <></>
    }
}
