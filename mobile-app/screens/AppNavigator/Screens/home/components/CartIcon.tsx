import { AppScreenName } from "@screens/AppNavigator/ScreenName.enum";
import { BasketScreenName } from "@screens/AppNavigator/Screens/basket/BasketScreenName.enum";
import { useNavigation } from "@react-navigation/native";
import { ShoppingBasket } from "lucide-react-native";
import { Pressable, Animated, Easing } from "react-native";
import React, { useRef, useEffect } from "react";
import { tailwind } from "@tailwind";

export const CartIcon = () => {
    const navigation = useNavigation<any>();
    const goToBasket = () => {
        navigation.navigate(AppScreenName.BASKET, {
            screen: BasketScreenName.SINGLE_BASKET,
        });
    };

    // Animated value for the glowing effect
    const glowAnim = useRef(new Animated.Value(0)).current;

    // Start the glowing animation when the component mounts
    useEffect(() => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(glowAnim, {
                    toValue: 1,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false, // `useNativeDriver` doesn't support shadow props
                }),
                Animated.timing(glowAnim, {
                    toValue: 0,
                    duration: 1000,
                    easing: Easing.inOut(Easing.ease),
                    useNativeDriver: false,
                }),
            ])
        ).start();
    }, [glowAnim]);

    const glowShadow = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [5, 20],
    });

    const glowOpacity = glowAnim.interpolate({
        inputRange: [0, 1],
        outputRange: [0.2, 0.7],
    });

    return (
        <Pressable
            onPress={goToBasket}
            style={tailwind(
                "absolute right-3 bottom-20"
            )}
        >
            <Animated.View
                style={[

                    tailwind('bg-red-500 rounded-full w-14 h-14 flex flex-row items-center justify-center'),
                    {
                        shadowColor: "#ff0000", // Glowing red shadow color
                        shadowOffset: { width: 0, height: 0 }, // Centered shadow
                        shadowOpacity: glowOpacity, // Interpolated opacity
                        shadowRadius: glowShadow, // Interpolated shadow size
                        elevation: glowShadow, // Android shadow
                    },
                ]}
            >
                <ShoppingBasket style={tailwind("text-white")} size={40} />
            </Animated.View>
        </Pressable>
    );
};
