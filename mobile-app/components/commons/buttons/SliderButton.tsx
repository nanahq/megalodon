import React, {forwardRef, useImperativeHandle, useRef, useState} from 'react';
import { View, Text, Animated, PanResponder, Dimensions } from 'react-native';
import { tailwind } from '@tailwind';
import { ArrowRight, Check } from 'lucide-react-native';

interface SlideToOrderProps {
    onOrderComplete: () => void;
    totalAmount: string;
    buttonText?: string;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const BUTTON_HEIGHT = 56;
const BUTTON_WIDTH = SCREEN_WIDTH - 32;
const SLIDER_WIDTH = BUTTON_HEIGHT - 4;

export interface SlideToOrderRef {
    reset: () => void;
}
export const SlideToOrderButton = forwardRef<SlideToOrderRef, SlideToOrderProps>(({
                                                                                      onOrderComplete,
                                                                                      totalAmount,
                                                                                      buttonText = 'Slide to order',
                                                                                  }, ref) => {
    const [isCompleted, setIsCompleted] = useState(false);
    const slideAnimation = useRef(new Animated.Value(0)).current;
    const fadeAnimation = useRef(new Animated.Value(1)).current;
    const [showCheck, setShowCheck] = useState(false);


    const resetSlider = () => {
        slideAnimation.stopAnimation();
        fadeAnimation.stopAnimation();

        setIsCompleted(false);
        setShowCheck(false);

        Animated.parallel([
            Animated.timing(slideAnimation, {
                toValue: 0,
                duration: 200,
                useNativeDriver: true,
            }),
            Animated.timing(fadeAnimation, {
                toValue: 1,
                duration: 200,
                useNativeDriver: true,
            }),
        ]).start();
    };

    useImperativeHandle(ref, () => ({
        reset: resetSlider
    }));


    const textOpacity = slideAnimation.interpolate({
        inputRange: [0, (BUTTON_WIDTH - SLIDER_WIDTH) * 0.5],
        outputRange: [1, 0],
        extrapolate: 'clamp',
    });

    const handleCompleteOrder = () => {
        onOrderComplete()
    }

    const panResponder = useRef(
        PanResponder.create({
            onStartShouldSetPanResponder: () => true,
            onPanResponderMove: (_, gestureState) => {
                const newPosition = Math.max(0, Math.min(gestureState.dx, BUTTON_WIDTH - SLIDER_WIDTH));
                slideAnimation.setValue(newPosition);
                if (gestureState.dx > (BUTTON_WIDTH - SLIDER_WIDTH) * 0.5) {
                    setShowCheck(true);
                } else {
                    setShowCheck(false);
                }
            },
            onPanResponderRelease: (_, gestureState) => {
                const slideThreshold = (BUTTON_WIDTH - SLIDER_WIDTH) * 0.5;
                if (gestureState.dx >= slideThreshold) {
                    Animated.parallel([
                        Animated.timing(slideAnimation, {
                            toValue: BUTTON_WIDTH - SLIDER_WIDTH,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                        Animated.timing(fadeAnimation, {
                            toValue: 0,
                            duration: 200,
                            useNativeDriver: true,
                        }),
                    ]).start(async () => {

                       await handleCompleteOrder();
                    })
                    Animated.spring(slideAnimation, {
                        toValue: 0,
                        useNativeDriver: true,
                    }).start(() => {
                        setShowCheck(false);
                    });
                }
            },
        })
    ).current;


    return (
        <View style={tailwind("p-4 bg-transparent")}>
            <View style={tailwind("w-full flex-col  rounded-full bg-primary-100 py-5 justify-center items-center overflow-hidden relative")}>
                {/* Background Text */}
                <Animated.Text
                    style={[
                        tailwind("text-center text-lg font-semibold text-white text-center"),
                        { opacity: textOpacity }
                    ]}
                >
                    Slide to place order
                </Animated.Text>

                {/* Total Amount */}
                <Animated.View style={[
                    tailwind("absolute right-5"),
                    { opacity: textOpacity }
                ]}>
                    <Text style={tailwind("text-base text-sm font-normal text-white")}>
                        {totalAmount}
                    </Text>
                </Animated.View>

                {/* Slider */}
                <Animated.View
                    {...panResponder.panHandlers}
                    style={[
                        tailwind("absolute rounded-full bg-white justify-center items-center"),
                        {
                            width: 52,
                            height: 52,
                            left: 2,
                            transform: [{ translateX: slideAnimation }],
                        }
                    ]}
                >
                    {showCheck ? (
                        <Check size={24} style={tailwind('text-slate-900')} />
                    ) : (
                        <ArrowRight size={24} style={tailwind('text-slate-900')} />
                    )}
                </Animated.View>
            </View>
        </View>
    );
});
