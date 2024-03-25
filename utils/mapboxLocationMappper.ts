export function mapboxLocationMapper<T>(coordinates?: [number, number], toCoordinateString: boolean = false): [number, number] | T {
    if (coordinates === undefined) {
        return [0, 0]
    }
    const formatted: [number, number] = [coordinates[1], coordinates[0]]
    return toCoordinateString ? formatted.join(',') as T : formatted
}
