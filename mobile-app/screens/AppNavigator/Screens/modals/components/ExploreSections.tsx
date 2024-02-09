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
        <View style={tailwind('bg-white my-5 px-3 py-5')}>
            <View style={tailwind('mb-2')}>
                <Text style={tailwind('text-xl text-black')}>Explore</Text>
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
        <Pressable onPress={onPress} style={[tailwind('flex flex-col justify-center items-center ml-2 '), {width: 100}]}>
            <FastImage
                source={{uri: props.vendor.businessLogo, priority: FastImage.priority.high}}
                resizeMode={FastImage.resizeMode.cover}
                style={[tailwind('rounded-full'), {width: 60, height: 60}]}
            />
            <Text style={tailwind('text-center text-xs mt-2')}>{props.vendor.businessName}</Text>
        </Pressable>
    )
}
