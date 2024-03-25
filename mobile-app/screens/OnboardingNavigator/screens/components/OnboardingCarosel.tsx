import {useSafeAreaInsets} from 'react-native-safe-area-context'

import OnboardingCorouselImage from '@assets/onboarding/onboarding_image_4.png'
import SiteLogoGreenWhite from '@assets/onboarding/nana-logo.png'

import {Dimensions,Image, ImageBackground, View} from "react-native";
import { tailwind} from "@tailwind";
import * as Device from 'expo-device'


// Needs for it to work on web. Otherwise, it takes full window size


export function OnboardingCarousel(): JSX.Element {
    const { width, height } = Device.modelName === "web" ? { width: 375, height: 652 } : Dimensions.get("window");

    const { top: topInsert } = useSafeAreaInsets();

    return (
        <View style={[tailwind('flex-1'), { width, height: height - 240 }]}>
            <ImageBackground source={OnboardingCorouselImage} resizeMode='cover' style={tailwind('flex-1')}>
                {/* <View style={styles.overlay} /> */}
                <View style={[tailwind('flex justify-center w-full flex-row'), { paddingTop: topInsert + 30 }]}>
                    <Image source={SiteLogoGreenWhite} resizeMode="contain" style={{ width: 150, height: 150}} />
                </View>
            </ImageBackground>
        </View>
    );
}
