import {tailwind} from "@tailwind";
import {Dimensions, ImageBackground, View} from "react-native";
import AuthImage from "@assets/onboarding/authentication-image.png";
import {PropsWithChildren} from "react";

export function ImageWithTextRow (props: PropsWithChildren<{}>): JSX.Element {
    const {width, height} = Dimensions.get('window')
    return (
        <View style={[tailwind('overflow-hidden mt-11'), {width, height: height - 491}]}>
            <ImageBackground source={AuthImage} resizeMode='cover' style={tailwind('flex-1 flex  items-center')}>
                {props.children}
            </ImageBackground>
        </View>
    )
}
