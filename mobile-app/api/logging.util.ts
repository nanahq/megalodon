/**
 * Project wide log object for reporting. This can be further abstracted
 */
export const Logger = {
    error: (message: any): void => {
        // eslint-disable-next-line
        console.error(message)
    },

    warn: (message: any): void => {
        // eslint-disable-next-line
        console.warn(message)
    },

    info: (message: any): void => {
        // eslint-disable-next-line
        console.log(message)
    }
}
