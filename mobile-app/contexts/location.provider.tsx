
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import * as Location from "expo-location";
import {LocationCoordinates, UpdateUserDto} from "@nanahq/sticky";
import {_api} from "@api/_request";
import {useLoading} from "@contexts/loading.provider";


const supportedCites = [
    'kano'
]

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

                const [firstResult] = await Location.reverseGeocodeAsync({
                    latitude: location.coords.latitude,
                    longitude: location.coords.longitude,
                });

                if (firstResult) {
                    setCity(`${firstResult.region}, ${firstResult.country}`);
                    setIsWithinSupportedCities(supportedCites.includes(firstResult.region?.toLowerCase()))
                } else {
                    setError('Could not determine city');
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
