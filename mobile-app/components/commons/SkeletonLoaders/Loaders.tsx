import ContentLoader, {IContentLoaderProps, Rect} from "react-content-loader/native";
import * as React from "react";


export function VendorLocationInformation (
    props: JSX.IntrinsicAttributes &
        IContentLoaderProps & { children?: React.ReactNode }
): JSX.Element {
    return (

        <ContentLoader
            width={300}
            height={22}
            viewBox="0 0 300 22"
            backgroundColor="#f2f2f2"  // Lighter gray color
            foregroundColor="#d0d0d0"  // Even lighter gray color
            {...props}
        >
            <Rect x="0" y="0" rx="2" ry="2" width="300" height="22" />
        </ContentLoader>
    )
}



export function VendorCategoriesItem(props: JSX.IntrinsicAttributes & IContentLoaderProps & { children?: React.ReactNode }): JSX.Element {
    const categoryWidth = 120;
    const categoryHeight = 160;
    const categorySpacing = 20;
    const numCategories = 3; // Adjust the number of categories as needed

    const containerWidth = numCategories * (categoryWidth + categorySpacing);

    return (
        <ContentLoader
            width={containerWidth}
            height={categoryHeight}
            viewBox={`0 0 ${containerWidth} ${categoryHeight}`}
            backgroundColor="#f2f2f2"
            foregroundColor="#d0d0d0"
            {...props}
        >
            {[...Array(numCategories)].map((_, index) => (
                <Rect
                    key={index}
                    x={index * (categoryWidth + categorySpacing)}
                    y="0"
                    rx="2"
                    ry="2"
                    width={categoryWidth}
                    height={categoryHeight}
                />
            ))}
        </ContentLoader>
    );
}


