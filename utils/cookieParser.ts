export function cookieParser (cookieString: string): string {
    return cookieString.split('; ')[0].split('=')[1]
}
