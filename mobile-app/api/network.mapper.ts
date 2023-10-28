export type NetworkType = "PLAYGROUND" | "PRODUCTION"
export type APIService = 'API_GATEWAY' | 'VENDOR_GATEWAY' | 'ADMIN_GATEWAY'


export const NetworkMapper: Record<NetworkType, string> = {
    PLAYGROUND: 'http://k8s-default-nanahydr-874b0d28d1-561484973.af-south-1.elb.amazonaws.com',
    PRODUCTION: process.env.API_URL ?? 'http://k8s-default-nanahydr-874b0d28d1-561484973.af-south-1.elb.amazonaws.com'
}


export const PlaygroundServicePort: Record<APIService, number> = {
    API_GATEWAY: 3000,
    VENDOR_GATEWAY: 3001,
    ADMIN_GATEWAY: 3002

}

export const ApiRoute: Record<APIService, string> = {
    API_GATEWAY: `api-gateway`,
    VENDOR_GATEWAY: `vendor-gateway`,
    ADMIN_GATEWAY: `admin-gateway`
}
