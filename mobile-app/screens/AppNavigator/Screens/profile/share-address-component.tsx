import React from 'react';
import {
    Pressable,
    Text,
    Share as RNShare,
    StyleProp,
    ViewStyle,
    TextStyle
} from 'react-native';
import * as Linking from 'expo-linking';
import {tailwind} from '@tailwind'


const SOCIAL_PLATFORMS = {
    whatsapp: {
        ios: 'whatsapp://send?text=',
        android: 'https://wa.me/?text='
    },
    telegram: {
        ios: 'tg://msg?text=',
        android: 'https://t.me/share/url?url=&text='
    },
    facebook: {
        ios: 'fb-messenger://share?link=',
        android: 'https://www.facebook.com/sharer/sharer.php?u='
    },
    twitter: {
        ios: 'twitter://post?message=',
        android: 'https://twitter.com/intent/tweet?text='
    },
    instagram: {
        ios: 'instagram-stories://share',
        android: 'https://www.instagram.com/create/select/'
    }
};

type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;

interface MultiShareProps {
    text: string;
    url?: string;
    platform?: SocialPlatform;
    children?: React.ReactNode;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    onShareComplete?: () => void;
    onShareError?: (error: Error) => void;
}

export const MultiShare: React.FC<MultiShareProps> = ({
                                                          text,

                                                          children,
                                                          style,
                                                          textStyle,
                                                          onShareComplete,
                                                      }) => {
    const shareContent = async () => {
        try {
            const result = await RNShare.share({
                message: text,
               title: "Share"
            });

            // Check if share was successful
            if (result.action === "sharedAction") {
                onShareComplete?.();
            }
        } catch (nativeShareError) {
            console.log(nativeShareError)
        }
    };

    return (
        <Pressable
            onPress={shareContent}
            style={({ pressed }) => [
                {
                    opacity: pressed ? 0.5 : 1,
                },
                style
            ]}
        >
            {children || (
                <Text style={[

                    textStyle
                ]}>
                    Share on address
                </Text>
            )}
        </Pressable>
    );
};

const getPlatformColor = (platform: SocialPlatform) => {
    const platformColors: Record<SocialPlatform, string> = {
        whatsapp: '#25D366',
        telegram: '#0088cc',
        facebook: '#3b5998',
        twitter: '#1DA1F2',
        instagram: '#C13584'
    };
    return platformColors[platform];
};


