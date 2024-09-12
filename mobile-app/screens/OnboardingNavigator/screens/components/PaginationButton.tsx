import { tailwind } from "@tailwind";
import React, { useCallback, useEffect, useState } from "react";
import { PaginationProps } from "react-native-swiper-flatlist";
import {Pressable, Text, View} from "react-native";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {useNavigation} from "@react-navigation/native";
import {OnboardingScreenName} from "@screens/OnboardingNavigator/ScreenName.enum";

interface PaginationButtonProps extends PaginationProps {
    dismissModal: () => void;
}
export function PaginationButton({
                                     paginationIndex = 0,
                                     scrollToIndex,
                                     size,
                                 }: PaginationButtonProps): JSX.Element {

    const [curIndex, setCurIndex] = useState(paginationIndex);
    const [buttonLabel, setButtonLabel] = useState("Next");
    const navigator = useNavigation<any>()
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
       <View style={tailwind('flex flex-col w-full')} >
           <GenericButton
               backgroundColor={tailwind('bg-primary-100')}
               labelColor={tailwind('text-white')}
               label={endOfPagination ? "Get started" : "Next"}
               onPress={() => {
                   if (endOfPagination) {
                       return navigator.navigate(OnboardingScreenName.ENTER_MOBILE_PHONE);
                   } else {
                       return goToNextPage(curIndex + 1);
                   }
               }}
           />
           <Pressable onPress={() => navigator.navigate(OnboardingScreenName.ENTER_MOBILE_PHONE)} style={tailwind('mt-5 flex flex-row justify-center')}>
               <Text>Skip</Text>
           </Pressable>
       </View>
    );
}
