import React, { useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {tailwind} from '@tailwind';
import {
    DeliveryI,
    LocationCoordinates,
    OrderI,
    SOCKET_MESSAGE,
    TravelDistanceResult
} from '@nanahq/sticky';
import DeliveryIcon from '@assets/app/delivery-icon.png'
import HomeIcon from '@assets/app/home.png'
import MapView, { Marker, PROVIDER_GOOGLE, Region, Polyline } from 'react-native-maps'
import {Sound} from "expo-av/build/Audio/Sound";
import {socket} from "../../../../../../App";


const mapStyle = [
    {
        elementType: "geometry",
        stylers: [{ color: "#f5f5f5" }]
    },
    {
        elementType: "labels.icon",
        stylers: [{ visibility: "off" }]
    },
    {
        elementType: "labels.text.fill",
        stylers: [{ color: "#666666" }]
    },
    {
        elementType: "labels.text.stroke",
        stylers: [{ color: "#ffffff" }]
    },
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [{ color: "#e0e0e0" }]
    },
    {
        featureType: "poi",
        stylers: [{ visibility: "off" }]
    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [{ color: "#ffffff" }]
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [{ color: "#999999" }]
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [{ color: "#ffffff" }]
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#e9e9e9" }]
    }
];

const style = StyleSheet.create({
    markerWrap: {
        // alignItems: "center",
        // justifyContent: "center",
        // backgroundColor: '#000000AA',
        // borderRadius: 2,
        // padding: 4,
    },
    marker: {
        width: 30,
        height: 30,
        // tintColor: '#fff'
    },
    deliveryMarker: {
        width: 40,
        height: 40,
        // backgroundColor: '#000',
        // borderRadius: 20,
        // borderWidth: 3,
        // borderColor: '#fff',
        // shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    deliveryIcon: {
        width: 30,
        height: 30,
        // tintColor: '#fff'
    }
});

const DEFAULT_LOCATION = {
    type: "Point",
    coordinates: [0, 0]
};

export function calculateDeltas(point1: [number, number], point2: [number, number]): Region {
    const latitudeDelta = Math.abs(point2[0] - point1[0]) * 2;
    const longitudeDelta = Math.abs(point2[1] - point1[1]) * 2;

    return {
        latitude: (point1[0] + point2[0]) / 2,
        longitude: (point1[1] + point2[1]) / 2,
        latitudeDelta: Math.max(latitudeDelta, 0.02),
        longitudeDelta: Math.max(longitudeDelta, 0.02),
    };
}

export function coordinatedMapper(point1: LocationCoordinates, point2: LocationCoordinates): Array<{ latitude: number, longitude: number }> {
    if (!point1?.coordinates || !point2?.coordinates) {
        return [];
    }
    return [
        { latitude: point1.coordinates[0], longitude: point1.coordinates[1] },
        { latitude: point2.coordinates[0], longitude: point2.coordinates[1] },
    ]
}

const { height: SCREEN_HEIGHT } = Dimensions.get("window");

export const Map: React.FC<{ order: OrderI, delivery: DeliveryI }> = ({ order, delivery }) => {
    const mapRef = useRef<MapView | null>(null);
    const markerAnimation = useRef(new Animated.Value(0)).current;
    const initialLocation = {type: 'Point', coordinates: [delivery?.driver?.location.coordinates[1], delivery?.driver?.location.coordinates[0]]} as any || DEFAULT_LOCATION as LocationCoordinates;
    const [currentDeliveryPosition, setCurrentDeliveryPosition] = useState<LocationCoordinates>(initialLocation);
    const [prevDeliveryPosition, setPrevDeliveryPosition] = useState<LocationCoordinates>(initialLocation);
    const [_sound] = useState<Sound | null>(null);

    const animateMarker = (newLocation: LocationCoordinates) => {
        console.log(newLocation)
        if (!newLocation?.coordinates) return;

        setPrevDeliveryPosition(currentDeliveryPosition);
        setCurrentDeliveryPosition(newLocation);

        markerAnimation.setValue(0);
        Animated.timing(markerAnimation, {
            toValue: 1,
            duration: 2000,
            useNativeDriver: true,
        }).start();
    };

    useEffect(() => {
        if (socket.connected) {
            socket.on('connect', () => {
                console.log('connected!')
            })
            socket?.on(SOCKET_MESSAGE.DRIVER_LOCATION_UPDATED, (message: { deliveryId: string, location: LocationCoordinates, travelMeta?: TravelDistanceResult }) => {

                if (message.deliveryId.toString() === delivery?._id.toString() && message.location) {
                    animateMarker(message.location);
                }
            });
        }
    }, [socket.connected]);

    useEffect(() => {
        const coordinates = coordinatedMapper(delivery.pickupLocation, delivery.dropOffLocation);
        if (coordinates.length > 0) {
            mapRef.current?.fitToCoordinates(coordinates, {
                edgePadding: { top: 100, right: 100, left: 100, bottom: 100 },
                animated: true
            });
        }
    }, [delivery]);

    const interpolatedLatitude = markerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            prevDeliveryPosition?.coordinates?.[0] || 0,
            currentDeliveryPosition?.coordinates?.[0] || 0
        ]
    });

    const interpolatedLongitude = markerAnimation.interpolate({
        inputRange: [0, 1],
        outputRange: [
            prevDeliveryPosition?.coordinates?.[1] || 0,
            currentDeliveryPosition?.coordinates?.[1] || 0
        ]
    });

    if (!delivery?.pickupLocation?.coordinates || !delivery?.dropOffLocation?.coordinates) {
        return null;
    }

    return (
        <View style={tailwind('flex-1 bg-white flex flex-col justify-center')}>
            <View style={[tailwind('w-full'), { width: '100%', height: SCREEN_HEIGHT / 2 }]}>
                <MapView
                    customMapStyle={mapStyle}
                    ref={mapRef}
                    style={{ width: '100%', height: '100%' }}
                    provider={PROVIDER_GOOGLE}
                    initialRegion={calculateDeltas(
                        delivery.pickupLocation.coordinates,
                        delivery.dropOffLocation.coordinates
                    )}
                >
                    <Polyline
                        coordinates={coordinatedMapper(delivery.dropOffLocation, delivery?.assignedToDriver ? currentDeliveryPosition : delivery.dropOffLocation)}
                        strokeColor="#000"

                        strokeWidth={3}
                        lineDashPattern={[1]}
                    />

                    <Marker
                        key={delivery._id}
                        coordinate={{
                            latitude: delivery.pickupLocation.coordinates[0],
                            longitude: delivery.pickupLocation.coordinates[1],
                        }}
                    >
                        <View style={style.markerWrap}>
                            <Animated.Image
                                source={{uri: order.vendor.businessLogo}}
                                style={style.marker}
                                resizeMode="cover"
                            />
                            <Animated.Text style={[tailwind('text-slate-900 text-base font-normal'), {fontSize: 10}]}>
                                {order.vendor.businessName}
                            </Animated.Text>
                        </View>
                    </Marker>

                    <Marker
                        coordinate={{
                            latitude: delivery.dropOffLocation.coordinates[0],
                            longitude: delivery.dropOffLocation.coordinates[1],
                        }}
                    >
                        <View style={style.markerWrap}>
                            <Animated.Image
                                source={HomeIcon}
                                style={style.marker}
                                resizeMode="cover"
                            />
                            <Animated.Text style={[tailwind('text-slate-900 text-base font-normal'), {fontSize: 10}]}>
                                Delivery address
                            </Animated.Text>
                        </View>
                    </Marker>

                    {delivery.assignedToDriver && currentDeliveryPosition?.coordinates && (
                        <Marker.Animated
                            coordinate={{
                                latitude: interpolatedLatitude,
                                longitude: interpolatedLongitude,
                            }}
                        >
                            <View style={style.deliveryMarker}>
                                <Animated.Image
                                    source={DeliveryIcon}
                                    style={[style.deliveryIcon, {
                                        transform: [{
                                            rotate: markerAnimation.interpolate({
                                                inputRange: [0, 1],
                                                outputRange: ['0deg', '360deg']
                                            })
                                        }]
                                    } as any]}
                                    resizeMode="cover"
                                />
                            </View>
                        </Marker.Animated>
                    )}
                </MapView>
            </View>
        </View>
    );
};
