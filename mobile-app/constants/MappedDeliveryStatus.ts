import {OrderStatus} from "@nanahq/sticky";

// PROCESSED = "ORDER_PLACED",
//     ACCEPTED = "ORDER_ACCEPTED",
//     COLLECTED = "COLLECTED_FROM_VENDOR",
//     IN_ROUTE = "OUT_FOR_DELIVERY",
//     FULFILLED = "DELIVERED_TO_CUSTOMER",
//     PAYMENT_PENDING = "PAYMENT_PENDING",
//     COURIER_PICKUP = "COURIER_PICKUP"
export const MappedDeliveryStatus: Record<OrderStatus, string> = {
    COLLECTED_FROM_VENDOR: "Order ready for delivery",
    COURIER_PICKUP: "string",
    DELIVERED_TO_CUSTOMER: "Order Delivered",
    ORDER_ACCEPTED: "string",
    ORDER_PLACED: "Order Paid",
    OUT_FOR_DELIVERY: "Delivery In progress",
    PAYMENT_PENDING: "Payment pending"

}
