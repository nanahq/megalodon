import React, {memo, useMemo} from "react";
import {ListingMenuI} from "@nanahq/sticky";
import {Image, Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import * as Device from "expo-device";
import {useAppSelector} from "@store/index";
import FastImage from "react-native-fast-image";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";

const _ListingCard: React.FC<{listing: ListingMenuI}>  = (props)=> {
    const {vendors} = useAppSelector(state => state.vendors)
    const isAndroid = Device.osName === 'Android'
    const navigation = useNavigation<NavigationProp<AppParamList>>()
    const vendor = useMemo(() => {
        return vendors?.find(vendor => vendor._id === props.listing.vendor as any)
    }, [vendors, props.listing.vendor])

    return (
        <Pressable onPress={() => navigation.navigate(ModalScreenName.MODAL_LISTING_SCREEN, {
            listing: props.listing,
            isScheduled: true,
        })} style={[tailwind("w-full mb-4 flex flex-col mr-5"), { width: 300, height: 215 }]}>
            <View style={tailwind("flex flex-col w-full")}>
                <FastImage source={{ uri: props.listing.photo}} resizeMode={FastImage.resizeMode.cover} style={[tailwind("w-full rounded-lg"), { height: isAndroid ? 150 : 155 }]} />
            </View>
            <View style={tailwind("p-2")}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <Text style={tailwind("flex text-lg text-black")}>{props.listing.name}</Text>
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