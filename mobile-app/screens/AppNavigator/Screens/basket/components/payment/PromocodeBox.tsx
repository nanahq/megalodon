import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {usePromoCode} from "@contexts/PromoCode";
import {TicketPercent} from "lucide-react-native";

const _PromocodeBox: React.FC = () => {
    const navigation = useNavigation<any>()
    const {couponFormattedMeta, coupon} = usePromoCode()
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-base text-slate-900 font-normal mb-2')}>Have a promo code?
                <Text style={tailwind('text-xs font-normal text-slate-500')}>   *optional</Text>
            </Text>
            <Pressable onPress={() => navigation.navigate(ModalScreenName.MODAL_PROMO_SCREEN)} style={tailwind('border-0.5 border-slate-200 py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <TicketPercent  style={tailwind('text-primary-100')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('text-sm text-slate-900 font-normal')}>{coupon === undefined ? 'Redeem discount code' : coupon.code}</Text>
                        {couponFormattedMeta !== undefined && (
                            <Text style={tailwind('text-sm text-slate-900 font-normal')}>{couponFormattedMeta}</Text>
                        )}
                    </View>
                    <IconComponent iconType="Feather" name="chevron-right" size={20} style={tailwind('text-gray-500')} />
                </View>
            </Pressable>
        </View>
    )
}

export const PromocodeBox = memo(_PromocodeBox)
