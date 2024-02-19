import React, {useEffect} from "react";
import {StackScreenProps} from "@react-navigation/stack";
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import {SafeAreaView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconButton} from "@components/commons/buttons/IconButton";
import Constants from "expo-constants";
import {AccountScreenItem} from "@screens/AppNavigator/Screens/profile/components/ProfileSection";
import {useAppSelector} from "@store/index";
import {showTost} from "@components/commons/Toast";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";
import {useToast} from "react-native-toast-notifications";
import * as Device from 'expo-device';
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {useAnalytics} from "@segment/analytics-react-native";

type AccountScreenNavigationProps = StackScreenProps<ProfileParamsList, ProfileScreenName.ACCOUNT>

export const AccountScreen: React.FC<AccountScreenNavigationProps> = ({navigation}) => {
    const {profile} = useAppSelector(state => state.profile)
    const {clearToken} = useAuthPersistence()
    const toast = useToast()
    const {top} = useSafeAreaInsets()
    const analytics = useAnalytics()

    const isAndroid = Device.osName === 'Android'


    useEffect(() => {
        void analytics.screen(ProfileScreenName.ACCOUNT)
    }, [])
    async  function onLogoutPress (): Promise<void>{
        showTost(toast, 'Log out success', 'success')
        await clearToken()
    }
    return (
        <View style={tailwind('px-4 flex-1 bg-white')}>
            <SafeAreaView style={{paddingTop: isAndroid ? top + 10 : 0 }} >
                <View>
                        <IconButton
                            onPress={() => navigation.goBack()}
                            iconName='arrow-left'
                            iconType='Feather'
                            iconSize={32}
                            style={tailwind('bg-brand-ash rounded-full p-3 w-14 h-14')}
                        />
                    <View style={tailwind('w-full mt-3 flex flex-row items-center justify-between')}>
                        <Text style={tailwind('font-bold text-xl')}>Account</Text>
                        <Text style={tailwind('text-lg text-brand-gray-700')}>v{Constants.expoConfig?.version}</Text>
                    </View>
                </View>
                <View style={tailwind('flex flex-col mt-5')}>
                    <AccountScreenItem
                        label="Name"
                        onPress={() => navigation.navigate(ProfileScreenName.EDIT_ACCOUNT, {
                            value: `${profile.firstName} ${profile.lastName}`,
                            type: 'Name',
                            hasDefaults: profile.firstName !== undefined
                        })}
                        defaultValue={`${profile.firstName} ${profile.lastName}`}
                        showDefaults={true as any}
                    />
                    <AccountScreenItem
                        label="Phone"
                        onPress={() => navigation.navigate(ProfileScreenName.EDIT_ACCOUNT, {
                            value: profile.phone,
                            type: 'Phone',
                            hasDefaults: profile.phone !== undefined
                        })}
                        defaultValue={profile.phone}
                    />
                    <AccountScreenItem
                        label="Email"
                        onPress={() => navigation.navigate(ProfileScreenName.EDIT_ACCOUNT, {
                            value: profile.email,
                            type: 'Email',
                            hasDefaults: profile.email !== undefined
                        })}
                        defaultValue={profile.email}
                    />


                    <View style={tailwind('flex flex-col mb-5 mt-5')}>
                        <Text style={tailwind('text-xl font-bold mb-2')}>Data Protection</Text>
                        <View style={tailwind('flex flex-col')}>
                            <AccountScreenItem
                                label="Terms of service"
                                onPress={() => {}}
                            />
                            <AccountScreenItem
                                label="Privacy policy"
                                onPress={() => {}}
                            />
                        </View>
                    </View>

                    <View>
                        <AccountScreenItem
                            label="Log Out"
                            onPress={onLogoutPress}
                        />
                        <AccountScreenItem
                            labelStyle={tailwind('text-error-600')}
                            label="Delete account"
                            onPress={() => {}}
                        />
                    </View>
                </View>
            </SafeAreaView>
        </View>
    )
}
