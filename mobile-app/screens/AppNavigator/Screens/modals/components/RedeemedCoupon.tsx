import {CouponI} from "@nanahq/sticky";
import {View, Text} from "react-native";
import {tailwind} from "@tailwind";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import moment from 'moment'
import {usePromoCode} from "@contexts/PromoCode";
import {useMemo} from "react";

export const RedeemedCoupon: React.FC<{coupon: CouponI, cb?: () => void}> = ({coupon, cb}) => {
    const {coupon : selectedCoupon, updateCoupon} = usePromoCode()

    const formattedMessage = useMemo<string | undefined>(() => {
        if (coupon === undefined) {
            return undefined
        }

        switch (coupon.type) {
            case "FREE_SHIPPING":
                return 'Free delivery'

            case "PERCENTAGE":
                return `${coupon.percentage}% off your order`

            case "CASH":
                return `N${coupon.value} off your next order`

            default:
                return 'No coupon'
        }
    }, [coupon])
    return (
        <View style={tailwind('bg-primary-500 rounded-lg p-4 my-3')}>
          <View>
              <Text style={tailwind('text-white font-bold text-xl')}>{coupon.code}</Text>
              <Text style={tailwind('text-white text-lg')}>{formattedMessage}</Text>
          </View>
            <View style={tailwind('flex flex-row justify-between items-center')}>
                <View>
                    <Text style={tailwind('text-white')}>Valid till {moment(coupon.validTill).format('MMMM YYYY')}</Text>
                </View>
                <GenericButton disabled={selectedCoupon?._id === coupon._id} onPress={() => updateCoupon(coupon, cb)} labelColor={tailwind('py-2 text-base px-5')} label={selectedCoupon?._id === coupon._id ? 'Applied' : 'Apply'} backgroundColor={tailwind('bg-white')} />
            </View>
        </View>
    )
}
