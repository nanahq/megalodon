import {IconButton} from "@components/commons/buttons/IconButton";
import {tailwind} from "@tailwind";
import React from "react";
import { View} from "react-native";

interface BackButtonProps {
    onPress: () => void
    testID: string
}

export function BackButton (props: BackButtonProps): JSX.Element {
    return (
       <View>
               <IconButton
                   {...props}
                   testID="EnterPhoneNumberScreen.BackButton"
                   iconSize={30}
                   iconName='arrow-left'
                   iconType='Feather'
                   iconStyle={tailwind('text-black')}
                   style={tailwind('')}
               />
       </View>
    )
}
