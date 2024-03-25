export function PhoneNumberFormater (): void {}

function validate ($phoneNumber: string): boolean {
    let isValid: boolean = false
    const arr = $phoneNumber.split('')

//    check length
    if (arr.length === 11) {
isValid = true
}

//    check if phone number does not include country code
    if (arr[0] === "0") {
isValid = true
}


    return isValid
}


function format ($phoneNumber: string): string {
    const arr = $phoneNumber.split('').slice(0).join('')
    return `+234${arr}`
}

PhoneNumberFormater.validate = validate
PhoneNumberFormater.format = format
