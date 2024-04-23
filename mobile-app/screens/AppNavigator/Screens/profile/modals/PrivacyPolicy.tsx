import React, {useEffect} from 'react';
import { StackScreenProps} from '@react-navigation/stack';
import { AppParamList } from '@screens/AppNavigator/AppNav';
import { tailwind } from '@tailwind';
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import { WebView } from 'react-native-webview';
import {useAnalytics} from "@segment/analytics-react-native";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";

type PrivacyPolicyProps = StackScreenProps<AppParamList>;

export const PrivacyPolicy: React.FC<PrivacyPolicyProps> = ({ navigation }) => {
    const privacyPolicyPage = 'https://www.trynanaapp.com/privacy'
    const analytics = useAnalytics()
    useEffect(() => {
        void analytics.screen(ProfileScreenName.PRIVACY)
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Privacy Policy`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            presentation: 'modal',
            cardShadowEnabled: true,
            cardOverlayEnabled: true,
            animationEnabled: true,
            headerLeft: () => <ModalCloseIcon onPress={handleNavigationBack} />,
        });
    }, []);
    const handleNavigationBack = () => {
        navigation.goBack();
    };

    return (
        <WebView  style={tailwind('flex-1')}
                 source={{ uri: privacyPolicyPage }}
        />
    );
};
