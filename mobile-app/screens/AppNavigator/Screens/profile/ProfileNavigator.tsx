import {
    CardStyleInterpolators,
    createStackNavigator, HeaderStyleInterpolators
} from "@react-navigation/stack";
import React from "react";
import { ProfileScreenName } from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import { ProfileScreen } from "@screens/AppNavigator/Screens/profile/Profile.Screen";
import {tailwind} from "@tailwind";
import * as Device from "expo-device";
import {AccountScreen} from "@screens/AppNavigator/Screens/profile/Account.Screen";
import {EditAccountScreen} from "@screens/AppNavigator/Screens/profile/EditAccount.Screen";
import {AddressBookScreen} from "@screens/AppNavigator/Screens/profile/AddressBook.Screen";
import {WalletScreen} from "@screens/AppNavigator/Screens/profile/Wallet.Screen";

export interface ProfileParamsList {
    [ProfileScreenName.EDIT_ACCOUNT]: {
        value: string
        hasDefaults: boolean
        type: 'Email' | 'Phone' | 'Name'
    }
    [key: string]: undefined | object;
}

const Profile = createStackNavigator<ProfileParamsList>();

export const ProfileNavigator: React.FC = () => {
    const isAndroid = Device.osName === 'Android'
    return (
        <Profile.Navigator
            initialRouteName={ProfileScreenName.PROFILE_HOME}
            screenOptions={{
                headerStyleInterpolator: HeaderStyleInterpolators.forFade,
                animationEnabled: true,
                cardStyleInterpolator: isAndroid ?  CardStyleInterpolators.forScaleFromCenterAndroid : CardStyleInterpolators.forHorizontalIOS
            }}
        >
            <Profile.Screen
                component={ProfileScreen}
                name={ProfileScreenName.PROFILE_HOME}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: tailwind('text-xl'),
                    headerTitle: 'Profile',
                    headerBackTitleVisible: false,
                }}
            />

            <Profile.Screen
                component={AccountScreen}
                name={ProfileScreenName.ACCOUNT}
                options={{
                    headerShown: false
                }}
            />

            <Profile.Screen
                component={WalletScreen}
                name={ProfileScreenName.WALLET}
                options={{
                    headerShown: true,
                    headerTitleAlign: 'center',
                    headerTitleStyle: tailwind('text-xl'),
                    headerTitle: 'Wallet',
                    headerBackTitleVisible: false,
                }}
            />

            <Profile.Screen
                component={AddressBookScreen}
                name={ProfileScreenName.ADDRESS_BOOK}
                options={{
                    headerShown: true,
                    presentation: 'modal',
                    headerTitleAlign: 'center',
                    headerTitleStyle: tailwind('text-xl'),
                    headerTitle: 'Saved addresses',
                    headerBackTitleVisible: false,
                }}
            />

            <Profile.Screen
                component={EditAccountScreen}
                name={ProfileScreenName.EDIT_ACCOUNT}
                options={{
                    headerShown: false
                }}
            />
        </Profile.Navigator>
    );
};
