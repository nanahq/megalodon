import React, {createContext, useContext, PropsWithChildren, useState, useCallback, useMemo} from "react";
import {CouponI} from "@nanahq/sticky";

export interface PromoCodeContextProps {
   coupon?: CouponI

    updateCoupon: (coupon?: CouponI, cb?: () => void) => void

    calculateCoupon: (cartValue: number) => number | undefined

    couponFormattedMeta?: string
}

const PromoCodeContext = createContext<PromoCodeContextProps>({} as any);

export function usePromoCode(): PromoCodeContextProps {
    return useContext(PromoCodeContext);
}


export function PromoCodeProvider(
    props: PropsWithChildren<any>
): JSX.Element | null {
    const [coupon, setCoupon] = useState<CouponI | undefined>(undefined)
    const calculateCoupon = useCallback<(cartValue: number) => number | undefined>((cartValue: number) => {
        if (coupon === undefined) {
            return undefined
        }

        if (coupon.type === 'PERCENTAGE') {
            return  (cartValue / 100) * Number(coupon.percentage ?? 0)
        } else if (coupon.type === 'CASH') {
            return Number(coupon.value)
        } else {
            return 0
        }
    }, [coupon])



    const updateCoupon = (coupon?: CouponI, callBack?: () => void) => {
        setCoupon(coupon)
        if (callBack) {
            callBack()
        }
    }
    const formattedMessage = useMemo<string | undefined>(() => {
        if (coupon === undefined) {
            return undefined
        }

        switch (coupon.type) {
            case "FREE_SHIPPING":
                return 'Free delivery'

            case "PERCENTAGE":
                return `${coupon.percentage}% off this order`

            case "CASH":
                return `${coupon.value} Naira off this order`

            default:
                return 'No coupon'
        }
    }, [coupon])
    return (
        <PromoCodeContext.Provider value={{coupon, updateCoupon, calculateCoupon, couponFormattedMeta: formattedMessage}}>
            {props.children}
        </PromoCodeContext.Provider>
    );
}
