import {useNavigation} from "@react-navigation/native";
import {View, Text} from 'react-native'
import {tailwind} from '@tailwind'
import {useEffect, useRef} from "react";
import Lottie from "lottie-react-native";
import Animation from "@assets/animations/lottie-success.json";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {SafeAreaView} from "react-native-safe-area-context";
export const SuccessScreen = () => {
    const navigation = useNavigation<any>()

    const animationRef = useRef<any>(null)

    useEffect(() => {
        animationRef.current?.play()
    }, [])
    return (
        <SafeAreaView style={tailwind('flex flex-col w-full')}>
            <ModalCloseIcon onPress={() => navigation.navigate(HomeScreenName.HOME)} />
            <Lottie
                ref={animationRef}
                style={{
                    width: 400,
                    height: 400
                }}
                source={Animation}
                autoPlay
                loop={false}
            />
            <Text style={tailwind('text-center text-slate-900 text-3xl mb-3 font-bold')}>Order has been placed successfully!</Text>
            <Text style={tailwind('text-center font-normal text-slate-900 px-5')}>
                You can track your order live on the orders screen!
            </Text>
        </SafeAreaView>
    )
}
