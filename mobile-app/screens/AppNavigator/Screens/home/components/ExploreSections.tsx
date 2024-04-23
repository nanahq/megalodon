import {ScrollView, View, Text, Pressable} from "react-native";
import {VendorUserI} from "@nanahq/sticky";
import FastImage from "react-native-fast-image";
import {tailwind} from "@tailwind";
import React from "react";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppParamList} from "@screens/AppNavigator/AppNav";

export const ExploreSections: React.FC<{vendors: VendorUserI[]}> = (props) => {
    return (
        <View style={tailwind('bg-white mt-2 px-3 py-1')}>
            <View style={tailwind('mb-2')}>
                <Text style={tailwind('text-xl text-black')}>Restaurants near you</Text>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} >
                {props.vendors.map(vendor => (
                    <VendorItem vendor={vendor} key={vendor.businessImage} />
                ))}
            </ScrollView>
        </View>
    )
}

export const VendorItem: React.FC<{vendor: VendorUserI}> = (props) => {
    const navigator = useNavigation<NavigationProp<AppParamList>>()

    const onPress = () => navigator.navigate(ModalScreenName.MODAL_VENDOR_SCREEN, {
        vendor: props.vendor,
        delivery: undefined
    })
    return (
        <Pressable onPress={onPress} style={[tailwind('flex flex-col justify-center items-center'), {width: 90}]}>
            <FastImage
                source={{uri: props.vendor.businessLogo, priority: FastImage.priority.high}}
                resizeMode={FastImage.resizeMode.cover}
                style={[tailwind('rounded-full'), {width: 40, height: 40}]}
            />
            <Text style={tailwind('text-center text-gray-500 text-xs mt-2')}>{props.vendor.businessName}</Text>
        </Pressable>
    )
}
