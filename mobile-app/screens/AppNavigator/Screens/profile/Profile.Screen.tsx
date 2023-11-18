import { Text, ScrollView, View, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {useAppSelector} from "@store/index";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import React, {useEffect} from "react";
import {IconButton} from "@components/commons/buttons/IconButton";
import {ProfileAvatar} from "@screens/AppNavigator/Screens/profile/components/ProfileAvatar";
import {getInitials} from "../../../../../utils/getInitials";
import {NumericFormat as NumberFormat} from "react-number-format";
import {ProfileSection} from "@screens/AppNavigator/Screens/profile/components/ProfileSection";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";

export const ProfileScreen = () => {
    const navigation = useNavigation<NavigationProp<ProfileParamsList>>()
    const {profile, hasFetchedProfile} = useAppSelector(state => state.profile)


    if(!hasFetchedProfile) {
        return <LoaderComponentScreen />
    }


    return (
        <ScrollView style={tailwind('flex-1 bg-white px-4')}>
               <View style={tailwind('mt-6 mb-5')}>
                   <Text style={tailwind('font-bold text-3xl')}>Hi {profile?.firstName ?? 'User'}!</Text>
               </View>
               <Pressable onPress={() => navigation.navigate(ProfileScreenName.ACCOUNT, {
                   profile
               })} style={tailwind('flex flex-row items-center justify-between w-full border-b-0.5 border-brand-ash py-4 ')}>
                  <View style={tailwind('flex flex-row items-center')}>
                      <ProfileAvatar initials={getInitials(`${profile.firstName} ${profile.lastName}`)} />
                      <View style={tailwind('ml-5')}>
                          {profile?.firstName && profile?.lastName && (
                              <Text style={tailwind('font-bold text-xl')}>{`${profile.firstName} ${profile.lastName}`}</Text>
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
               <Pressable style={tailwind('flex flex-row items-center justify-between w-full border-b-0.5 border-brand-ash py-4')}>
                   <View style={tailwind('flex flex-col')}>
                       <Text style={tailwind('text-lg')}>Wallet</Text>
                       <Text style={tailwind('text-warning-600 text-sm')}>Wallet feature will be available soon</Text>
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
                   {/* <ProfileSection.Item onPress={() => {} } label="Enter promo code" /> */}
                   <ProfileSection.Item onPress={() => {} } label="Contact customer support" />
                   <ProfileSection.Item onPress={() => {} } label="Payment history" />
                   {/* <ProfileSection.Item onPress={() => {} } label="Send a gift" /> */}
               </ProfileSection>

               <ProfileSection heading="Settings">
                   <ProfileSection.Item onPress={() => navigation.navigate(ProfileScreenName.ACCOUNT)} label="Account" />
                   {/* <ProfileSection.Item onPress={() => {} } label="Payment Methods" /> */}
                   <ProfileSection.Item onPress={() => navigation.navigate(ProfileScreenName.ADDRESS_BOOK)} label="My Addresses" />
                   {/* <ProfileSection.Item onPress={() => {} } label="Wallet & Credits" /> */}
               </ProfileSection>
        </ScrollView>
    )
}


