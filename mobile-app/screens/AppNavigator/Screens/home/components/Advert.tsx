import {tailwind} from "@tailwind";
import React, { PropsWithChildren } from 'react';
import { View, Image, Dimensions, ImageURISource, TouchableOpacity } from 'react-native';

interface AdvertProps {
    source: ImageURISource;
    onClick?: () => void;
}

export const AdvertComponent: React.FC<PropsWithChildren<AdvertProps>> = ({
                                                                              children,
                                                                              onClick,
                                                                              source
                                                                          }) => {
    const { width: screenWidth } = Dimensions.get('window');

    const adWidth = screenWidth * 0.9; // 90% of screen width
    const adHeight = adWidth * (200/500); // Maintain 500:200 aspect ratio

    const AdWrapper = onClick ? TouchableOpacity : View;

    return (

            <AdWrapper
                onPress={onClick}
                style={{
                    marginVertical: 20,
                    paddingHorizontal: 20,
                    borderRadius: 8,
                    overflow: 'hidden',
                }}
            >
                <Image
                    source={source}
                    style={{
                        borderRadius: 8,
                        width: adWidth,
                        height: adHeight,
                        resizeMode: 'cover',
                    }}
                />
                {children}
            </AdWrapper>
    );
};

export const AdvertMiniComponent: React.FC<PropsWithChildren<{source: ImageURISource,height?: number, onClick?: () => void}>> = ({children, onClick, source, height}) => {
    const {width: screenWidth} = Dimensions.get('window')
    return (
            <View style={{borderRadius: 0, overflow: 'hidden'}}>
                <Image
                    source={source}
                    style={[tailwind(), {width: screenWidth, height: height ?? 50}]}
                />
            </View>
    )
}
