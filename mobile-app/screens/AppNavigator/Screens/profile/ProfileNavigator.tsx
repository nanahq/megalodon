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
import {ProfileStateI} from "@store/profile.reducer";
import {EditAccountScreen} from "@screens/AppNavigator/Screens/profile/EditAccount.Screen";
import {AddressBookScreen} from "@screens/AppNavigator/Screens/profile/AddressBook.Screen";
import {useNavigation} from "@react-navigation/native";

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
    const navigation = useNavigation()
    return (
        <Profile.Navigator
            initialRouteName={ProfileScreenName.PROFILE_HOME}
            screenOptions={{
                animationEnabled: true,
                cardStyleInterpolator: isAndroid ?  CardStyleInterpolators.forScaleFromCenterAndroid : CardStyleInterpolators.forVerticalIOS
            }}
        >
            <Profile.Screen
                component={ProfileScreen}
                name={ProfileScreenName.PROFILE_HOME}
                options={{
                    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
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
                component={AddressBookScreen}
                name={ProfileScreenName.ADDRESS_BOOK}
                options={{
                    headerStyleInterpolator: HeaderStyleInterpolators.forUIKit,
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
