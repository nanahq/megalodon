import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {usePromoCode} from "@contexts/PromoCode";

const _PromocodeBox: React.FC = () => {
    const navigation = useNavigation<any>()
    const {couponFormattedMeta, coupon} = usePromoCode()
    return (
        <View style={tailwind('mt-10')}>
            <Pressable onPress={() => navigation.navigate(ModalScreenName.MODAL_PROMO_SCREEN)} style={tailwind('border-0.5 border-brand-ash py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <IconComponent iconType="AntDesign" name="tag" style={tailwind('text-black')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('')}>{coupon === undefined ? 'Add promo code' : coupon.code}</Text>
                        {couponFormattedMeta !== undefined && (
                            <Text style={tailwind(' text-center text-brand-gray-700 text-sm')}>{couponFormattedMeta}</Text>
                        )}
                    </View>
                    <IconComponent iconType="Feather" name="chevron-right" size={20} style={tailwind('text-gray-500')} />
                </View>
            </Pressable>
        </View>
    )
}

export const PromocodeBox = memo(_PromocodeBox)
