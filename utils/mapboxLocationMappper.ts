export function mapboxLocationMapper(coordinates?: [number, number]): [number, number] {
    if(coordinates === undefined) {
        return [0, 0]
    }
    return [coordinates[1], coordinates[0]]
}
