export function mapboxLocationMapper(coordinates?: [number, number], toCoordinateString: boolean = false): [number, number] | string {
    if (coordinates === undefined) {
        return [0, 0]
    }
    const formatted: [number, number] = [coordinates[1], coordinates[0]]
    return toCoordinateString ? formatted.join(',')  : formatted
}
