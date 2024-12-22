
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import * as Location from "expo-location";
import {LocationCoordinates, UpdateUserDto} from "@nanahq/sticky";
import {_api} from "@api/_request";
import {useLoading} from "@contexts/loading.provider";


const supportedCites = [
    'kano'
]

function extractLocalityState(data: any): string | undefined {
    // Check if results array exists and has at least one result
    if (!data.results || data.results.length === 0) {
        return null;
    }

    // Get the first result
    const result = data.results[0];

    // Find locality and administrative area level 1
    const neighborhood = result.address_components.find(
        component => component.types.includes('neighborhood')
    );

    const locality = result.address_components.find(
        component => component.types.includes('locality')
    );

    const state = result.address_components.find(
        component => component.types.includes('administrative_area_level_1')
    );

    // If both are found, return an object with their short names
    if (locality && state) {
        return `${locality.long_name}, ${state.long_name}`;
    }

    return undefined;
}

export interface LocationProviderValues {
    currentCity: string
    isWithinSupportedCities: boolean

    locationPermission: Location.PermissionStatus

    updateInterimLocationStatus: (status: Location.PermissionStatus) => void
}

const LocationContext = createContext<LocationProviderValues>({} as any);

export function useLocation(): LocationProviderValues {
    return useContext(LocationContext);
}

export function LocationProvider (props: PropsWithChildren<any>): any {
    const [city, setCity] = useState<string>('');
    const [locationPermission, setLocationPermission] = useState<Location.PermissionStatus>(Location.PermissionStatus.DENIED)
    const [isWithinSupportedCities, setIsWithinSupportedCities] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const {setLoadingState} = useLoading()

    const value: LocationProviderValues = {
        currentCity: city,
        isWithinSupportedCities,
        locationPermission,
        updateInterimLocationStatus: (status: Location.PermissionStatus) => setLocationPermission(status as any)
    }


    async function updateLocation (latitude: number, longitude: number) {
        setLoadingState(true)
        const location: LocationCoordinates = {
            type: 'Point',
            coordinates: [latitude, longitude]
        }

        try {
            await _api.requestData<Partial<UpdateUserDto>>({
                method: 'PUT',
                url: 'user/update',
                data: {location}
            })
        } catch (error: any) {
            return undefined
        } finally {
            setLoadingState(false)
        }
    }

    const fetchDeliveryMeta = async (latitude: number, longtitude: number): Promise<string | undefined> => {
        const apiKey = 'AIzaSyBjFkN1A1PHGRRDK9EejYcQOQxtO-piDRA';
        const url = `/maps/api/geocode/json?latlng=${latitude},${longtitude}&key=${apiKey}`;

        try {
            const {data} = await  _api.requestData<null, any>({
                method: 'GET',
                baseUrl: 'https://maps.googleapis.com',
                url,
            })

            if(Boolean(data.results[0]?.formatted_address)) {
               return  extractLocalityState(data)
            } else {
                return undefined
            }
        } catch (error) {
            console.error('Error fetching GeoJSON:', error);
            throw error;
        }
    };


    useEffect(() => {
        (async () => {
            try {
                setLoadingState(true);
                const { status } = await Location.requestForegroundPermissionsAsync();
                setLocationPermission(status)
                if (status !== 'granted') {
                    setError('Permission to access location was denied');
                    setLoadingState(false);
                    return;
                }
                const location = await Location.getCurrentPositionAsync({
                    accuracy: Location.Accuracy.Highest,
                });


                const formattedAddress = await fetchDeliveryMeta(location.coords.latitude, location.coords.longitude)

                if(formattedAddress !== undefined) {
                    setCity(formattedAddress);


                    supportedCites.some(city => {
                        return formattedAddress.includes(city)
                    })

                    setIsWithinSupportedCities(supportedCites.some(city => {
                        return formattedAddress.toLowerCase().includes(city.toLowerCase())
                    }))

                } else {
                    const [firstResult] = await Location.reverseGeocodeAsync({
                        latitude: location.coords.latitude,
                        longitude: location.coords.longitude,
                    });
                    setCity(`${firstResult.region}, ${firstResult.country}`);
                    setIsWithinSupportedCities(supportedCites.includes(firstResult.region?.toLowerCase()))
                }





                void updateLocation(location.coords.latitude, location.coords.longitude)
            } catch (err) {
                setError(err.message);
            } finally {
                setLoadingState(false);
            }
        })();
    }, []);
    return (
        <LocationContext.Provider value={value}>
            {props.children}
        </LocationContext.Provider>
    )
}
