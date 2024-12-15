import React, {useEffect} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import {SafeAreaView, View} from "react-native";
import {tailwind} from "@tailwind";
import {AccountScreenItem} from "@screens/AppNavigator/Screens/profile/components/ProfileSection";
import {showTost} from "@components/commons/Toast";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {useToast} from "react-native-toast-notifications";
import {useAnalytics} from "@segment/analytics-react-native";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {useProfile} from "@contexts/profile.provider";

type AccountScreenNavigationProps = StackScreenProps<ProfileParamsList, ProfileScreenName.ACCOUNT>

export const AccountScreen: React.FC<AccountScreenNavigationProps> = ({navigation}) => {
    const {profile} = useProfile()
    const {clearToken} = useAuthPersistence()
    const toast = useToast()
    const analytics = useAnalytics()

    useEffect(() => {
        void analytics.screen(ProfileScreenName.ACCOUNT)
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Profile",
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl font-bold text-slate-900'),
            headerLeft: () => <ModalCloseIcon size={18} onPress={() => navigation.goBack()} />,
        })
    }, [])
    async  function onLogoutPress (): Promise<void>{
        showTost(toast, 'Log out success', 'success')
        await clearToken()
    }
    return (
            <SafeAreaView style={tailwind('bg-white flex-1')} >
                <View style={tailwind('flex flex-col mt-5 px-5')}>
                    <AccountScreenItem
                        label="Name"
                        // onPress={() => navigation.navigate(ProfileScreenName.EDIT_ACCOUNT, {
                        //     value: `${profile.firstName} ${profile.lastName}`,
                        //     type: 'Name',
                        //     hasDefaults: profile.firstName !== undefined
                        // })}
                        defaultValue={`${profile.firstName} ${profile.lastName}`}
                        showDefaults={true as any}
                    />
                    <AccountScreenItem
                        label="Phone"
                        // onPress={() => navigation.navigate(ProfileScreenName.EDIT_ACCOUNT, {
                        //     value: profile.phone,
                        //     type: 'Phone',
                        //     hasDefaults: profile.phone !== undefined
                        // })}
                        defaultValue={profile.phone}
                    />
                    <AccountScreenItem
                        label="Email"
                        // onPress={() => navigation.navigate(ProfileScreenName.EDIT_ACCOUNT, {
                        //     value: profile.email,
                        //     type: 'Email',
                        //     hasDefaults: profile.email !== undefined
                        // })}
                        defaultValue={profile.email}
                    />


                    <View style={tailwind('flex flex-col mb-5 mt-5')}>
                        <View style={tailwind('flex flex-col')}>
                            <AccountScreenItem
                                label="Terms of service"
                                onPress={() => navigation.navigate<any>(ProfileScreenName.PRIVACY)}
                            />
                            <AccountScreenItem
                                label="Privacy policy"
                                onPress={() => navigation.navigate<any>(ProfileScreenName.PRIVACY)}
                            />
                        </View>
                    </View>
                    <View>
                        <AccountScreenItem
                            label="Log Out"
                            onPress={onLogoutPress}
                        />
                        <AccountScreenItem
                            labelStyle={tailwind('text-red-600')}
                            label="Delete account"
                            onPress={() => navigation.navigate<any>(ProfileScreenName.DELETE_ACCOUNT)}
                        />
                    </View>
                </View>
            </SafeAreaView>
    )
}
