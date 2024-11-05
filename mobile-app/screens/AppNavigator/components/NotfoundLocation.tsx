import React, {useEffect, useRef, useState} from "react";
import {Text, View} from "react-native";
import {tailwind} from "@tailwind";
import Lottie from "lottie-react-native";
import Animation from "@assets/animations/Not-found-location.json";
export const NotfoundLocation  = () => {

    const animationRef = useRef<any>(null)
    useEffect(() => {
        animationRef.current?.play()
    }, [])
    return (
        <View style={tailwind('flex flex-col bg-white items-center justify-center h-full w-full')}>
            <Lottie
                ref={animationRef}
                style={{
                    width: 300,
                    height: 300
                }}
                source={Animation}
                autoPlay={true}
                loop={true}
                useNativeLooping={true}
            />
            <View style={tailwind('px-7')}>
                <Text style={tailwind('text-center text-slate-500 text-2xl mb-2 font-bold')}>Sorry, we do not deliver here</Text>
                <Text style={tailwind('text-center font-normal text-lg text-slate-500 px-5')}>
                    We are expanding quickly, so please do check back soon!
                </Text>
            </View>
        </View>
    )
}
