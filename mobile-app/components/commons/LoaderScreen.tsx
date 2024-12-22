
import React, { useEffect, useRef } from 'react';
import { View, Animated } from 'react-native';
import { tailwind } from "@tailwind";
import { LinearGradient } from "expo-linear-gradient";
import Image  from "react-native-fast-image";
import Logo from "@assets/app-config/ios-icon-new.png";

export const LoaderScreen = () => {
    const scaleAnim = useRef(new Animated.Value(1)).current;

    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(scaleAnim, {
                    toValue: 1.2,
                    duration: 800,
                    useNativeDriver: true,
                }),
                Animated.timing(scaleAnim, {
                    toValue: 1,
                    duration: 800,
                    useNativeDriver: true,
                }),
            ])
        ).start();
    }, [scaleAnim]);

    return (
        <View style={[tailwind('absolute w-full top-0 left-0 h-full bg-transparent')]}>
            <LinearGradient
                colors={['rgba(30, 41, 59, 0.7)', 'rgba(30, 41, 59, 0.7)']}
                style={tailwind('absolute top-0 left-0 right-0 bottom-0')}
            />
            <View style={tailwind('w-full flex flex-row justify-center h-full flex-1 items-center')}>
                <Animated.View style={{ transform: [{ scale: scaleAnim }] } as any}>
                    <Image source={Logo} style={{ width: 100, height: 65 }} />
                </Animated.View>
            </View>
        </View>
    );
};
