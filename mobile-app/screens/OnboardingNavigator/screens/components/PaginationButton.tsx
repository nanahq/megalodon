import { tailwind } from "@tailwind";
import React, { useCallback, useEffect, useState } from "react";
import { PaginationProps } from "react-native-swiper-flatlist";
import {Pressable, Text} from "react-native";

interface PaginationButtonProps extends PaginationProps {
    dismissModal: () => void;
}
export function PaginationButton({
                                     paginationIndex = 0,
                                     scrollToIndex,
                                     dismissModal,
                                     size,
                                 }: PaginationButtonProps): JSX.Element {

    const [curIndex, setCurIndex] = useState(paginationIndex);
    const [buttonLabel, setButtonLabel] = useState("Next");

    const goToNextPage = useCallback(
        (curPage: number) => {
            if (curPage < size) {
                setCurIndex(curPage);
                scrollToIndex({ index: curPage });
            }
        },
        [scrollToIndex]
    );
    const endOfPagination = curIndex === size - 1;

    useEffect(() => {
        // check if user scrolls without pressing button or if animation is replayed
        if (curIndex !== paginationIndex) {
            return setCurIndex(paginationIndex);
        }
    }, [paginationIndex]);

    useEffect(() => {
        if (curIndex < size - 1) {
            return setButtonLabel("Next");
        } else {
            return setButtonLabel("Done");
        }
    }, [curIndex, paginationIndex]);

    return (
        <Pressable
            onPress={() => {
                if (endOfPagination) {
                    return dismissModal();
                } else {
                    return goToNextPage(curIndex + 1);
                }
            }}
            style={tailwind("rounded-full text-center py-3.5 px-4 border", {
                "bg-white": endOfPagination,
            })}
            testID={`${buttonLabel}_button`}
        >
            <Text
                style={tailwind("font-semibold-v2 text-center text-base")}

            >
                {buttonLabel}
            </Text>
        </Pressable>
    );
}
