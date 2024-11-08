import React, {memo, useMemo} from "react";
import {ListingMenuI} from "@nanahq/sticky";
import { Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import * as Device from "expo-device";
import FastImage from "react-native-fast-image";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {useAnalytics} from "@segment/analytics-react-native";
import {useVendor} from "@contexts/vendor.provider";

const _ListingCard: React.FC<{listing: ListingMenuI}>  = (props)=> {
    const {vendors} = useVendor()
    const isAndroid = Device.osName === 'Android'
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    const vendor = useMemo(() => {
        return vendors?.find(vendor => vendor._id === props.listing.vendor as any)
    }, [vendors, props.listing.vendor])

    const analytics = useAnalytics()

    const onPress = () => {
        void analytics.track('CLICK:LISTING-CARD-HOMEPAGE', {
            vendor: props.listing._id
        })
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(today.getDate() + 1);
        navigation.navigate(ModalScreenName.MODAL_LISTING_SCREEN, {
            listing: props.listing,
            isScheduled: true,
            vendor,
            availableDate: tomorrow.toISOString()
        })
    }

    return (
        <Pressable onPress={onPress} style={[tailwind("w-full mb-4 flex flex-col mr-5"), { width: 300, height: 180 }]}>
            <View style={tailwind("flex relative flex-col w-full")}>
                <FastImage source={{ uri: props.listing.photo}} resizeMode={FastImage.resizeMode.cover} style={[tailwind("w-full rounded-lg"), { height: isAndroid ? 120 : 125 }]} />
                <FastImage source={{ uri: vendor?.businessLogo}} resizeMode={FastImage.resizeMode.cover} style={[tailwind("w-full absolute top-2 left-1 rounded-full"), { height: 50, width: 50}]} />
            </View>
            <View style={tailwind("p-2")}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <Text style={tailwind("flex text-lg text-black w-2/3")} numberOfLines={1} ellipsizeMode="tail">{props.listing.name}</Text>
                    <Text style={tailwind("flex text-lg font-medium text-gray-700")}>{vendor?.businessName}</Text>
                </View>
                <View>
                    <Text style={tailwind("flex text-black")}>₦{props.listing.price}</Text>
                </View>
            </View>
        </Pressable>
    )
}
export const ListingMenuCard = memo(_ListingCard)
