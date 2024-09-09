import {Dimensions, Image, ImageURISource, View} from "react-native";
import {tailwind} from "@tailwind";
import React,  {PropsWithChildren} from "react";
export const AdvertComponent: React.FC<PropsWithChildren<{source: ImageURISource, onClick?: () => void}>> = ({children, onClick, source}) => {
    const {width: screenWidth} = Dimensions.get('window')
    return (
        <View style={[tailwind('flex-1 items-center my-5'), {paddingHorizontal: 2}]}>
            <View style={{borderRadius: 10, overflow: 'hidden'}}>
                <Image
                    source={source}
                    style={[tailwind(), {width: screenWidth * 0.9, height: (screenWidth * 0.9) * 0.5625}]}
                />
            </View>
        </View>
    )
}
