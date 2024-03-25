export interface ResponseWithError {
    statusCode: number
    timestamp: string,
    path: string,
    message: string | Object
}

export interface ResponseWithStatusCode {
    status: number
}
