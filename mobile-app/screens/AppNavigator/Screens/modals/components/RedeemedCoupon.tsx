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
        <View
            style={
                tailwind('bg-primary-50 rounded-lg p-4 my-3 border-0.5 border-gray-200')

            }
        >
          <View style={tailwind('border-b-0.5 my-2 border-gray-300')}>
              <Text style={tailwind('font-semibold text-lg')}>{coupon.code}</Text>
              <Text style={tailwind( 'text-base font-normal mt-0.5')}>{formattedMessage}</Text>
          </View>
            <View style={tailwind('flex flex-row justify-between items-center')}>
                <View>
                    <Text style={tailwind('text-sm font-normal')}>Valid till {moment(coupon.validTill).format('Do MMMM YYYY')}</Text>
                </View>
                <GenericButton disabled={selectedCoupon?._id === coupon._id} onPress={() => updateCoupon(coupon, cb)} labelColor={tailwind('text-base text-white')} label={selectedCoupon?._id === coupon._id ? 'Applied' : 'Apply to this order'} backgroundColor={tailwind('bg-primary-100 py-2 px-2')} />
            </View>
        </View>
    )
}
