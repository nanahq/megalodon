import { tailwind } from "@tailwind";
import React from "react";
import { Platform, StyleSheet, View } from "react-native";
import { Pagination, PaginationProps } from "react-native-swiper-flatlist";
import { PaginationButton } from "./PaginationButton";

export const CarouselPagination: React.FC<PaginationProps> = (props) =>  {
    return <Pagination {...props} paginationStyle={styles.paginationContainer} />;
}

interface CarouselPaginationWithNextButtonProps extends PaginationProps {
    dismissModal: () => void;
}

export function CarouselPaginationWithNextButton(
    props: CarouselPaginationWithNextButtonProps
): JSX.Element {
    return (
        <View
            style={tailwind("mt-10")}
        >
            <Pagination {...props} paginationStyle={styles.paginationContainer} />
            <View style={tailwind("px-14")}>
                <PaginationButton
                    {...props}

                    paginationStyle={styles.paginationContainer}
                />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    paginationContainer: {
        bottom: 0,
        height: 6,
        marginBottom: 64,
        marginVertical: 0,
        position: undefined,
    },
});
