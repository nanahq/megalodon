import {IconButton} from "@components/commons/buttons/IconButton";
import {tailwind} from "@tailwind";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import React from "react";
import {Dimensions, View} from "react-native";

interface BackButtonProps {
    onPress: () => void
    testID: string
}

export function BackButton (props: BackButtonProps): JSX.Element {
    const { bottom} = useSafeAreaInsets()
    const { height } = Dimensions.get("window");

    return (
       <View style={{bottom: bottom - height / 3}}>
               <IconButton
                   {...props}
                   testID="EnterPhoneNumberScreen.BackButton"
                   iconSize={40}
                   iconName='arrow-left'
                   iconType='Feather'
                   iconStyle={tailwind('text-black')}
                   style={tailwind('w-16 h-16 rounded-full bg-primary-200  flex items-center justify-center')}
               />
       </View>
    )
}
