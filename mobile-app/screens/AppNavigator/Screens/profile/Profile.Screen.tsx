import { Text, ScrollView, View, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import * as ClipBoard from 'expo-clipboard'
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import React, {useEffect} from "react";
import {ProfileAvatar} from "@screens/AppNavigator/Screens/profile/components/ProfileAvatar";
import {ProfileSection} from "@screens/AppNavigator/Screens/profile/components/ProfileSection";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {useAnalytics} from "@segment/analytics-react-native";
import {getInitials} from "../../../../../utils/getInitials";
import {useProfile} from "@contexts/profile.provider";
import {ChevronRight} from "lucide-react-native";

export const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp<ProfileParamsList>>()
    const {profile} = useProfile()
    const toast = useToast()
    const analytics = useAnalytics()
    const copy = (text: string): void => {
        void ClipBoard.setStringAsync(String(text))
        showTost(toast, 'Account number copied', 'success')
    }

    useEffect(() => {
        void analytics.screen(ProfileScreenName.PROFILE_HOME)
    }, [])

    return (
        <ScrollView style={tailwind('flex-1 bg-white px-4')}>
               <Pressable onPress={() => {
                   void analytics.track('CLICK:PROFILE-ACCOUNT')
                   navigation.navigate(ProfileScreenName.ACCOUNT as any, {
                       profile
                   } as any)
               } } style={tailwind('flex flex-row items-center justify-between w-full border-b-0.5 border-brand-ash py-4 ')}>
                  <View style={tailwind('flex flex-row items-center')}>
                      <ProfileAvatar initials={getInitials(`${profile.firstName} ${profile.lastName}`)} />
                      <View style={tailwind('ml-5')}>
                          {profile?.firstName && profile?.lastName && (
                              <Text style={tailwind('font-medium text-lg text-slate-900 capitalize')}>{`${profile.firstName} ${profile.lastName}`}</Text>
                          )}
                          <Text style={tailwind('font-normal text-sm text-slate-900')}>{profile.orders.length} orders</Text>
                      </View>
                  </View>
                   <ChevronRight
                       size={30}
                       style={tailwind('font-normal text-base text-slate-900')}
                   />
               </Pressable>
                {/* <View style={tailwind('flex flex-row items-center justify-center w-full my-3')}> */}
                {/*     <Pressable onPress={() => copy(profile.paystack_titan ?? '')} style={tailwind('bg-nana-lime px-4 py-1.5 w-2/3 rounded-lg')}> */}
                {/*         <View style={tailwind('flex flex-row items-center')}> */}
                {/*             <Text style={tailwind('text-white')}>{profile.paystack_titan}</Text> */}
                {/*             <View style={tailwind('flex flex-row items-center')}> */}
                {/*                 <Text style={tailwind('text-white')}> | Paystack-Titan</Text> */}
                {/*                 <IconButton iconName="copy" iconType="Feather"  iconStyle={tailwind('text-white')} iconSize={16} /> */}
                {/*             </View> */}
                {/*         </View> */}
                {/*     </Pressable> */}
                {/* </View> */}
               {/* <Pressable onPress={() => undefined} style={tailwind('flex flex-row items-center justify-between w-full border-b-0.5 border-brand-ash py-4')}> */}
               {/*     <View style={tailwind('flex flex-col')}> */}
               {/*         <Text style={tailwind('text-lg')}>Wallet</Text> */}
               {/*     </View> */}
               {/*     <View style={tailwind('flex flex-row items-center')}> */}
               {/*         <NumberFormat */}
               {/*             prefix="₦" */}
               {/*             value="0.00" */}
               {/*             thousandSeparator */}
               {/*             displayType="text" */}
               {/*             renderText={(value) => ( */}
               {/*                 <Text style={tailwind("font-bold")}>{value}</Text> */}
               {/*             )} */}
               {/*         /> */}
               {/*         <IconButton */}
               {/*             iconName="chevron-right" */}
               {/*             iconType="Feather" */}
               {/*             iconSize={30} */}
               {/*             iconStyle={tailwind('text-brand-gray-700')} */}
               {/*         /> */}
               {/*     </View> */}
               {/* </Pressable> */}
                <ProfileSection heading="Settings">
                    <ProfileSection.Item onPress={() => {
                        void analytics.track('CLICK:PROFILE-ACCOUNT')
                        navigation.navigate(ProfileScreenName.ACCOUNT as any)
                    } } label="Account" />
                    <ProfileSection.Item onPress={() => {
                        void analytics.track('CLICK:PROFILE-ADDRESS-BOOK')
                        navigation.navigate(ProfileScreenName.ADDRESS_BOOK as any)
                    } } label="Saved Addresses" />
                </ProfileSection>
               <ProfileSection heading="Quick Links">
                   <ProfileSection.Item disabled={true} onPress={() => {} } label="Invite friends" />
                    <ProfileSection.Item disabled={true} onPress={() => {} } label="Enter promo code" />
                   <ProfileSection.Item  disabled={true} onPress={() => {} } label="Contact customer support" />
                   <ProfileSection.Item disabled={true} onPress={() => {} } label="Payment history" />
                    <ProfileSection.Item disabled={true} onPress={() => {} } label="Send a gift" />
               </ProfileSection>

        </ScrollView>
    )
}


