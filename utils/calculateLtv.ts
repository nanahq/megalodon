interface LTVParams {
    totalOrderValue: number;        // Total value of all orders in currency
    totalOrderQuantity: number;     // Total number of orders made
    daysFromSignup: number;         // Days since customer signed up
    projectedCustomerLifespanDays?: number;  // Optional: Default 1 year projection
    churnThresholdDays?: number;    // Optional: Default churn threshold
}

interface LTVMetrics {
    ordersPerDay: number;
    daysAnalyzed: number;
}

interface LTVResult {
    currentLTV: number;
    averageOrderValue: number;
    orderFrequencyPerMonth: number;
    projectedYearlyValue: number;
    projectedLifetimeValue: number;
    metrics: LTVMetrics;
}

export function calculateBasicLTV(params: LTVParams): LTVResult {
    const {
        totalOrderValue,
        totalOrderQuantity,
        daysFromSignup,
        projectedCustomerLifespanDays = 365,  // Default: 1 year projection
        churnThresholdDays = 90               // Default: Consider churned after 90 days of inactivity
    } = params;

    // Input validation
    if (!totalOrderValue || !totalOrderQuantity || !daysFromSignup) {
        throw new Error('Missing required parameters');
    }

    if (daysFromSignup <= 0) {
        throw new Error('Days from signup must be greater than 0');
    }

    // Calculate basic metrics
    const averageOrderValue: number = totalOrderValue / totalOrderQuantity;
    const orderFrequencyPerDay: number = totalOrderQuantity / daysFromSignup;
    const orderFrequencyPerMonth: number = orderFrequencyPerDay * 30;

    // Calculate projected yearly value
    const projectedYearlyOrders: number = orderFrequencyPerDay * 365;
    const projectedYearlyValue: number = projectedYearlyOrders * averageOrderValue;

    // Calculate lifetime value based on projected customer lifespan
    const projectedLifetimeValue: number = (projectedYearlyValue / 365) * projectedCustomerLifespanDays;

    return {
        currentLTV: totalOrderValue,
        averageOrderValue,
        orderFrequencyPerMonth,
        projectedYearlyValue,
        projectedLifetimeValue,
        metrics: {
            ordersPerDay: orderFrequencyPerDay,
            daysAnalyzed: daysFromSignup
        }
    };
}