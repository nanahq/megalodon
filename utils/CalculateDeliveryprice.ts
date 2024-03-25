import {DELIVERY_PRICE_META} from "../CONSTANTS/APP_SETTINGS";

export function calculateDeliveryPrice(distance_km: number): number {
    const MAX_DELIVERY_FEE_PAYABLE = DELIVERY_PRICE_META.MAX_DELIVERY_FEE_PAYABLE;
    const BASE_FEE = DELIVERY_PRICE_META.BASE_FEE;
    const SHORT_DISTANCE_RATE = DELIVERY_PRICE_META.SHORT_DISTANCE_RATE;
    const MEDIUM_DISTANCE_RATE = DELIVERY_PRICE_META.MEDIUM_DISTANCE_RATE;
    const LONG_DISTANCE_RATE = DELIVERY_PRICE_META.LONG_DISTANCE_RATE;
    const COST_OF_GAS_PER_LITER = DELIVERY_PRICE_META.GAS_PRICE;

    // Calculate distance-based rate
    let ratePerKm;
    if (distance_km <= 3) {
        ratePerKm = SHORT_DISTANCE_RATE;
    } else if (distance_km <= 5) {
        ratePerKm = MEDIUM_DISTANCE_RATE;
    } else {
        ratePerKm = LONG_DISTANCE_RATE;
    }

    // Calculate gas consumption and cost
    const gasConsumedLiters = distance_km / 50;
    const gasCost = COST_OF_GAS_PER_LITER * gasConsumedLiters;

    // Calculate total delivery price
    const deliveryPrice = BASE_FEE + (ratePerKm * distance_km) + gasCost;

    // Round to the nearest tenth
    const roundedPrice = Math.ceil(deliveryPrice / 10) * 10;

    return Math.min(roundedPrice, MAX_DELIVERY_FEE_PAYABLE);
}
