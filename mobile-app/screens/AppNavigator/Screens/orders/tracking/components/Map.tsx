import React, { useEffect, useState } from 'react';
import {View, Text, Dimensions, ActivityIndicator, Pressable} from 'react-native';
import {getColor, tailwind} from '@tailwind';
import { IconComponent } from '@components/commons/IconComponent';
import { DeliveryI, LocationCoordinates, OrderI, TravelDistanceResult } from '@nanahq/sticky';
import { _api } from '@api/_request';
import MapboxGL from '@rnmapbox/maps';
import { NavigationProp, useNavigation } from "@react-navigation/native";
import { OrderParamsList } from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import { ModalCloseIcon } from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import { NetworkMapper } from "@api/network.mapper";
import { io, Socket } from "socket.io-client";
import * as Linking from 'expo-linking';
import {mapboxLocationMapper} from "../../../../../../../utils/mapboxLocationMappper";

const socketEndpoint = NetworkMapper.PRODUCTION;

const MAPBOX_APIKEY = 'pk.eyJ1Ijoic3VyYWphdXdhbCIsImEiOiJjbGxiNHhpNW8wMHBpM2lxb215NnZmN3ZuIn0.a6zWnzIF0KcVZ2AUiDNBDA';
MapboxGL.setAccessToken(MAPBOX_APIKEY);
MapboxGL.setTelemetryEnabled(false);
MapboxGL.setWellKnownTileServer('mapbox');

export const Map: React.FC<{ order: OrderI }> = ({ order }) => {
    const { height } = Dimensions.get('screen');
    const navigation = useNavigation<NavigationProp<OrderParamsList>>();
    const [deliveryInformation, setDeliveryInformation] = useState<DeliveryI | null>(null);
    const [currentLocation, setCurrentLocation] = useState<LocationCoordinates | undefined>(undefined);
    const [loading, setLoading] = useState(true);
    const [travelInformation, setTravelInformation] = useState<TravelDistanceResult | null>(null);
    const [socket, setSocketClient] = useState<Socket | null>(null);
    const [places, setPlaces] = useState<any>(null);

    useEffect(() => {
        let _socket: Socket;
        if (socket === null) {
            _socket = io(socketEndpoint, {
                transports: ['websocket'],
            });
            setSocketClient(_socket);
        }

        return () => {
            if (_socket) {
                _socket.disconnect();
            }
        };
    }, [socketEndpoint]);

    useEffect(() => {
        if (!socket) {
            return;
        }

        if (!deliveryInformation) {
            return;
        }

        socket.on('connect', () => {
            console.log('Websocket gateway connected');
        });

        socket.on('DRIVER_LOCATION_UPDATED', (message: { deliveryId: string, location: LocationCoordinates, travelMeta?: TravelDistanceResult}) => {
             setLoading(false);
            if (message.deliveryId === deliveryInformation?._id) {
                setPlaces(() => {
                    return {
                        type: 'FeatureCollection',
                        features: [
                            {
                                type: 'Feature',
                                properties: {
                                    description: deliveryInformation.order.deliveryAddress,
                                    icon: 'marker',

                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: deliveryInformation.dropOffLocation.coordinates,
                                },
                            },
                            {
                                type: 'Feature',
                                properties: {
                                    description: 'Your Food',
                                    icon: 'scooter',
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: message.location.coordinates,
                                },
                            }
                        ],
                    };
                });
                setCurrentLocation(() => message.location);

                // if(message.travelMeta !== undefined) {
                //     //Check if one minute left to delivery
                //     if(message.travelMeta.travelTime <= 1) {
                //     //     send expo notification
                //     //     play a sound
                //     }
                // }
            }
        });

        return () => {
            socket.close();
            socket.disconnect();
        };

    }, [socket, deliveryInformation]);

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
                                    icon: 'marker',

                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: information?.dropOffLocation.coordinates,
                                },
                            },
                            {
                                type: 'Feature',
                                properties: {
                                    description: 'Your Food',
                                    icon: 'scooter',
                                },
                                geometry: {
                                    type: 'Point',
                                    coordinates: information?.currentLocation.coordinates ?? [0,0],
                                },
                            }
                        ],
                    };
                });
                setCurrentLocation(() => information?.currentLocation as any);
            } catch (error) {
                console.error(error);
            } finally {
                setLoading(false);
            }
        };

        void fetchDeliveryInformation();

    }, []);


    return (
        <View style={tailwind('flex-1 relative flex flex-col items-center justify-center')}>
             {loading  || currentLocation === undefined ? (
                 <View style={tailwind('flex flex-row items-center justify-center flex-1 w-full')}>
                     <View style={tailwind('flex flex-col items-center')}>
                         <ActivityIndicator size="large" color={getColor('primary-500')} />
                         <Text style={tailwind('font-bold text-3xl text-center mt-4')}>Fetching Delivery Information..... it will take 3 seconds</Text>
                     </View>
                 </View>
             ) : (
                 <>
                     <View style={[tailwind('w-full'), { height }]}>
                         <MapboxGL.MapView
                             style={tailwind('flex-1')}
                             id="MapboxMap"
                             zoomEnabled
                             styleURL="mapbox://styles/mapbox/navigation-night-v1"
                             rotateEnabled
                         >
                             <MapboxGL.Camera
                                 centerCoordinate={mapboxLocationMapper(currentLocation?.coordinates) ?? [0,0]}
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
                                             textVariableAnchor: 'right',
                                             textPadding: 20,
                                             textColor: '#FF9629',
                                             textSize: 24
                                         }}
                                     />
                                 </MapboxGL.ShapeSource>
                             )}
                             <MapboxGL.PointAnnotation
                                 selected
                                 coordinate={mapboxLocationMapper(currentLocation?.coordinates) ?? [0,0]}
                                 id="UserCoords"
                             >
                                 <View>
                                     <IconComponent iconType="MaterialCommunityIcons" name="bike-fast" size={50} style={[tailwind('text-secondary-700'), {color: "#f96d1f"}]} />
                                 </View>
                             </MapboxGL.PointAnnotation>

                             <MapboxGL.PointAnnotation
                                 selected
                                 coordinate={mapboxLocationMapper(deliveryInformation?.dropOffLocation.coordinates) ?? mapboxLocationMapper(order.preciseLocation.coordinates)}
                                 id="VendorCoord"
                             >
                                 <View>
                                     <IconComponent iconType="Ionicons" name="ios-location-outline" size={50} style={tailwind('text-white')} />
                                 </View>
                             </MapboxGL.PointAnnotation>
                         </MapboxGL.MapView>
                     </View>

                     {deliveryInformation && (
                         <>
                             <View style={tailwind('absolute bottom-10 z-50  w-full px-4')}>
                                 <View style={[tailwind('flex flex-col rounded-3xl mt-4 p-4'), { backgroundColor: '#000' }]}>
                                     <Text style={tailwind('text-white text-sm')}>Delivery Person</Text>
                                     <View style={tailwind('flex flex-row items-center  justify-between')}>
                                         <Text style={tailwind('text-white text-xl')}>{`${deliveryInformation?.driver?.firstName} ${deliveryInformation?.driver?.lastName}`}</Text>
                                         <Pressable onPress={() => Linking.openURL(`tel:${deliveryInformation?.driver?.phone}`)} style={tailwind('p-2')}>
                                             <IconComponent name="telephone" iconType="Foundation" size={40} style={tailwind('text-success-500')} />
                                         </Pressable>
                                     </View>
                                     <Text style={tailwind('text-brand-ash')}>{deliveryInformation.driver.totalTrips} Trips Made</Text>
                                 </View>
                                 <View style={[tailwind('flex flex-col rounded-3xl mt-3 p-4'), { backgroundColor: '#000' }]}>
                                     <View style={tailwind('flex flex-row items-center')}>
                                         <Text style={tailwind('text-white text-4xl mr-2')}>ETA:</Text>
                                         <Text style={tailwind('text-white text-4xl text-brand-gray-700')}>9 minutes</Text>
                                     </View>
                                     <View style={tailwind('flex flex-col')}>
                                         <Text style={tailwind('text-white text-lg mr-2')}>Delivery Address</Text>
                                         <Text style={tailwind('text-white text-lg text-brand-gray-700')}>Suite C22 Ummi Plaza, Zoo road</Text>
                                     </View>
                                 </View>
                             </View>
                             <ModalCloseIcon
                                 size={40}
                                 onPress={() => navigation.goBack()}
                                 iconStyle={tailwind('text-black mx-0')}
                                 buttonStyle={tailwind('absolute rounded-full p-2 bg-white top-10 left-5')}
                             />
                         </>
                     )}
                 </>
             )}
        </View>
    );
};

