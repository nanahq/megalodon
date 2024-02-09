import { Text, ScrollView, View, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {useAppSelector} from "@store/index";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import * as ClipBoard from 'expo-clipboard'
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import React from "react";
import {IconButton} from "@components/commons/buttons/IconButton";
import {ProfileAvatar} from "@screens/AppNavigator/Screens/profile/components/ProfileAvatar";
import {NumericFormat as NumberFormat} from "react-number-format";
import {ProfileSection} from "@screens/AppNavigator/Screens/profile/components/ProfileSection";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {getInitials} from "../../../../../utils/getInitials";

export const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp<ProfileParamsList>>()
    const {profile, hasFetchedProfile} = useAppSelector(state => state.profile)
    const toast = useToast()
    const copy = (text: string): void => {
        ClipBoard.setStringAsync(String(text))
        showTost(toast, 'Account number copied', 'success')
    }

    if (!hasFetchedProfile) {
        return <LoaderComponentScreen />
    }

    return (
        <ScrollView style={tailwind('flex-1 bg-white px-4')}>
               <View style={tailwind('mt-6 mb-3')}>
                   <Text style={tailwind('font-bold text-3xl capitalize')}>Hi {profile?.firstName ?? 'User'}!</Text>
               </View>
               <Pressable onPress={() => navigation.navigate(ProfileScreenName.ACCOUNT, {
                   profile
               })} style={tailwind('flex flex-row items-center justify-between w-full border-b-0.5 border-brand-ash py-4 ')}>
                  <View style={tailwind('flex flex-row items-center')}>
                      <ProfileAvatar initials={getInitials(`${profile.firstName} ${profile.lastName}`)} />
                      <View style={tailwind('ml-5')}>
                          {profile?.firstName && profile?.lastName && (
                              <Text style={tailwind('font-bold text-xl capitalize')}>{`${profile.firstName} ${profile.lastName}`}</Text>
                          )}
                          <Text>{profile.orders.length}+ Orders</Text>
                      </View>
                  </View>
                   <IconButton
                       iconName="chevron-right"
                       iconType="Feather"
                       iconSize={30}
                       iconStyle={tailwind('text-brand-gray-700')}
                   />
               </Pressable>
                <View style={tailwind('flex flex-row items-center justify-center w-full my-3')}>
                    <Pressable onPress={() => copy(profile.paystack_titan ?? '')} style={tailwind('bg-nana-lime px-4 py-1.5 w-2/3 rounded-lg')}>
                        <View style={tailwind('flex flex-row items-center')}>
                            <Text style={tailwind('text-white')}>{profile.paystack_titan}</Text>
                            <View style={tailwind('flex flex-row items-center')}>
                                <Text style={tailwind('text-white')}> | Paystack-Titan</Text>
                                <IconButton iconName="copy" iconType="Feather"  iconStyle={tailwind('text-white')} iconSize={16} />
                            </View>
                        </View>
                    </Pressable>
                </View>
               <Pressable onPress={() => navigation.navigate(ProfileScreenName.WALLET)} style={tailwind('flex flex-row items-center justify-between w-full border-b-0.5 border-brand-ash py-4')}>
                   <View style={tailwind('flex flex-col')}>
                       <Text style={tailwind('text-lg')}>Wallet</Text>
                   </View>
                   <View style={tailwind('flex flex-row items-center')}>
                       <NumberFormat
                           prefix="₦"
                           value="0.00"
                           thousandSeparator
                           displayType="text"
                           renderText={(value) => (
                               <Text style={tailwind("font-bold")}>{value}</Text>
                           )}
                       />
                       <IconButton
                           iconName="chevron-right"
                           iconType="Feather"
                           iconSize={30}
                           iconStyle={tailwind('text-brand-gray-700')}
                       />
                   </View>
               </Pressable>
               <ProfileSection heading="Quick Links">
                   <ProfileSection.Item onPress={() => {} } label="Invite friends" />
                    <ProfileSection.Item onPress={() => {} } label="Enter promo code" />
                   <ProfileSection.Item onPress={() => {} } label="Contact customer support" />
                   <ProfileSection.Item onPress={() => {} } label="Payment history" />
                    <ProfileSection.Item onPress={() => {} } label="Send a gift" />
               </ProfileSection>

               <ProfileSection heading="Settings">
                   <ProfileSection.Item onPress={() => navigation.navigate(ProfileScreenName.ACCOUNT)} label="Account" />
                   <ProfileSection.Item onPress={() => navigation.navigate(ProfileScreenName.ADDRESS_BOOK)} label="My Addresses" />
               </ProfileSection>
        </ScrollView>
    )
}


