import {ReviewI} from "@nanahq/sticky";
// AIzaSyBxd-WGMl-H1BdgKsG2dNBYoQiWXsXc-Y8
export type RiskFactor = 'HIGH' | 'LOW' | 'MEDIUM'
export interface VendorReviewRating {
    numberOfReview: number
    rating: number

    riskFactor: RiskFactor

}

export function rateVendor (vendorReviews: ReviewI[]): VendorReviewRating {
    let aggregateRating: number = 0
    let riskFactor: RiskFactor = 'MEDIUM'

    if (vendorReviews.length >= 5) {
        for (const review of vendorReviews) {
            aggregateRating += review.reviewStars
        }

        aggregateRating = aggregateRating / vendorReviews.length

        if (aggregateRating >= 4) {
            riskFactor = 'LOW'
        } else if (aggregateRating < 4 && aggregateRating > 2.5) {
            riskFactor = 'MEDIUM'
        } else {
            riskFactor = 'HIGH'
        }
    } else if (vendorReviews.length > 0 && vendorReviews.length < 5) {
        aggregateRating = vendorReviews.length
        riskFactor = 'LOW'
    }
    return {
        rating: aggregateRating,
        numberOfReview: vendorReviews.length,
        riskFactor
    }
}
