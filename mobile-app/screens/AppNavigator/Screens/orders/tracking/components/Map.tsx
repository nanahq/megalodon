import React, {memo, useEffect, useState} from 'react';
import {View, Text, ActivityIndicator} from 'react-native';
import {getColor, tailwind} from '@tailwind';
import { IconComponent } from '@components/commons/IconComponent';
import {
    DeliveryI,
    LocationCoordinates,
    OrderI,
    OrderStatus,
    SOCKET_MESSAGE,
    TravelDistanceResult
} from '@nanahq/sticky';
import { _api } from '@api/_request';
import MapboxGL from '@rnmapbox/maps';
import {useWebSocket} from "@contexts/SocketProvider";
import LocationTracker from '@assets/app/location-tracker.svg'
import moment from "moment";
import * as Notifications from "expo-notifications";
import {useExpoPushNotification} from "@hooks/useExpoNotification";
import {mapboxLocationMapper} from "../../../../../../../utils/mapboxLocationMappper";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";


const MAPBOX_APIKEY = 'pk.eyJ1Ijoic3VyYWphdXdhbCIsImEiOiJjbGxiNHhpNW8wMHBpM2lxb215NnZmN3ZuIn0.a6zWnzIF0KcVZ2AUiDNBDA';
MapboxGL.setAccessToken(MAPBOX_APIKEY);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('mapbox');

 const _Map: React.FC<{ order: OrderI }> = ({ order }) => {
    const [deliveryInformation, setDeliveryInformation] = useState<DeliveryI | null>(null);
    const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [places, setPlaces] = useState<any>(null);

    const {socketClient, isConnected} = useWebSocket()


     const [remainingTime, setRemainingTime] = useState<number | null>(deliveryInformation !== null ? calculateRemainingTime(deliveryInformation?.travelMeta?.travelTime as any) : null);
     const {schedulePushNotification} = useExpoPushNotification()

     useEffect(() => {
         if (deliveryInformation?.deliveryTime !== null) {
             const intervalId = setInterval(() => {
                 setRemainingTime(calculateRemainingTime(deliveryInformation?.travelMeta?.travelTime as any));
             }, 1000);

             // Cleanup interval on component unmount
             return () => clearInterval(intervalId);
         }
     }, [deliveryInformation?.deliveryTime]);

     function calculateRemainingTime(targetTime: number): number {
         const currentTime = moment(deliveryInformation?.order.updatedAt);
         const endTime = moment(deliveryInformation?.order.updatedAt).add(targetTime, 'minutes');
         const duration = moment.duration(endTime.diff(currentTime));

         // Calculate remaining time in minutes
         const remainingMinutes = duration.asMinutes();

         return Math.max(0, Math.round(remainingMinutes));
     }
    useEffect(() => {
        if (socketClient !== undefined && isConnected) {
            socketClient?.on(SOCKET_MESSAGE.DRIVER_LOCATION_UPDATED, (message: { deliveryId: string, location: LocationCoordinates, travelMeta?: TravelDistanceResult}) => {
                setLoading(false);
                if (message.deliveryId === deliveryInformation?._id) {
                    setPlaces(() => {
                        return {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    properties: {
                                        description: mapboxLocationMapper(deliveryInformation?.order?.deliveryAddress as any),
                                        icon: 'marker',

                                    },
                                    geometry: {
                                        type: 'Point',
                                        coordinates: mapboxLocationMapper(deliveryInformation.dropOffLocation.coordinates as any),
                                    },
                                },
                            ],
                        };
                    });
                    setCurrentLocation(() => message.location);
                }
            });

            socketClient?.on(SOCKET_MESSAGE.UPDATE_ORDER_STATUS, (message: {userId: string, orderId: string, status: OrderStatus, driver: string, vendorName?: string}) => {
                const isOrder = message.orderId === order._id
                if (isOrder) {
                    const notificationPayload: Notifications.NotificationRequestInput = {
                        trigger: {
                            seconds: 1,
                            repeats: false
                        },
                        identifier: OrderStatus.IN_ROUTE,
                        content: {
                            sticky: true,
                            badge: 2,
                            title: order.vendor.businessName,
                            body: 'Your order is on its way',
                            sound: 'default',
                            data: {
                                order
                            }
                        }
                    }
                    switch (message.status) {
                        case OrderStatus.IN_ROUTE:
                            void Notifications.getPermissionsAsync()
                            void schedulePushNotification(notificationPayload)
                            break;
                        default:
                    }
                }
            })
        }
    }, []);

    useEffect(() => {
        const fetchDeliveryInformation = async (): Promise<void> => {
            try {
                const information = (await _api.requestData({
                    method: 'GET',
                    url: `delivery/order/${order._id}`,
                })).data as DeliveryI | null;

                setDeliveryInformation(() => information);
                setPlaces(() => {
                    return {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {
                                    description: information?.order.deliveryAddress,
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: mapboxLocationMapper(information?.dropOffLocation.coordinates),
                                },
                            }
                        ],
                    };
                });

                const hasCurrentCoord = !checkForNullishCoords(information?.currentLocation?.coordinates as any)
                const current = hasCurrentCoord  ? information?.currentLocation : information?.driver?.location
                setCurrentLocation(() => current);
                // eslint-disable-next-line no-useless-catch
            } catch (error) {
                throw error
            } finally {
                setLoading(false);
            }
        };

        void fetchDeliveryInformation();

    }, []);
    function checkForNullishCoords (coord: [number, number] | null): boolean {
        if (coord === null) {
        return true
        } else if (coord[0] + coord[1] < 1) {
            return true
        }
        return false
    }


    return (
        <View style={tailwind('flex-1 bg-primary-200 flex flex-col items-center justify-center')}>
             {loading ? (
                 <LoaderComponentScreen />
             ) : (
                 <>
                     <View style={tailwind('w-full flex-1 flex-grow')}>
                         <MapboxGL.MapView
                             style={tailwind('flex-1')}
                             id="MapboxMap"
                             zoomEnabled
                             styleURL="mapbox://styles/mapbox/navigation-night-v1"
                             rotateEnabled
                         >
                             <MapboxGL.Camera
                                 centerCoordinate={mapboxLocationMapper(currentLocation?.coordinates)}
                                 zoomLevel={15}
                                 animationMode="flyTo"
                                 animationDuration={2000}
                                 pitch={60}
                             />
                             {places && (
                                 <MapboxGL.ShapeSource id="placesSource" shape={places}>
                                     <MapboxGL.SymbolLayer
                                         id="placesIconLayer"
                                         style={{
                                             iconImage: '{icon}-15',
                                             iconSize: 6,
                                             iconAllowOverlap: true,
                                             textField: ['get', 'description'],
                                             textPadding: 100,
                                             textColor: '#fff',
                                             textSize: 18,
                                             textAnchor: "left"
                                         }}
                                     />
                                 </MapboxGL.ShapeSource>
                             )}
                             <MapboxGL.PointAnnotation
                                 selected
                                 coordinate={mapboxLocationMapper(currentLocation?.coordinates)}
                                 id="UserCoords"
                             >
                                 <View>
                                     <LocationTracker width={50} height={50} />
                                 </View>
                             </MapboxGL.PointAnnotation>

                             <MapboxGL.PointAnnotation
                                 selected
                                 coordinate={mapboxLocationMapper(deliveryInformation?.dropOffLocation.coordinates) ?? mapboxLocationMapper(order.preciseLocation.coordinates)}
                                 id="VendorCoord"
                             >
                                 <View>
                                     <IconComponent iconType="Ionicons" name="md-location" size={50} style={tailwind('text-white')} />
                                 </View>
                             </MapboxGL.PointAnnotation>
                         </MapboxGL.MapView>
                     </View>
                     {deliveryInformation && (
                         <>
                             <View style={tailwind('w-full  px-4 py-4 z-50 bg-primary-200 h-1/5')}>
                                 <View style={tailwind('flex flex-col')}>
                                     <View style={tailwind('flex w-full  flex-col items-center')}>
                                         <View style={tailwind('flex flex-col bottom-2 justify-center  items-center rounded-full')}>
                                             {remainingTime !== null && (
                                                 <Text style={tailwind('text-black  text-black my-2 text-2xl')}>Arriving in {remainingTime} minutes</Text>
                                             )}
                                             <Text style={tailwind('text-black text-center text-black text-lg')}>Done! Your order is ready is been delivered now.</Text>
                                         </View>
                                     </View>
                                 </View>

                             </View>

                         </>
                     )}
                 </>
             )}
        </View>
    );
};


 export const Map = memo(_Map)
