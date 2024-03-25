export function getInitials(fullName: string): string {
    const names = fullName.split(' ');

    if (names.length === 0) {
        // No name provided
        return '';
    }

    const initials = names
        .map((name) => name.charAt(0).toUpperCase())
        .join('');

    return initials;
}
