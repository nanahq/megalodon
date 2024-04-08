export function cookieParser(cookies: string[]): string  {
    return  cookies[0].split(',').find(c => c.includes('Authentication=')) ?? ''
}
