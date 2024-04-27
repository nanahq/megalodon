import React, { useEffect, useRef, useState} from 'react';
import {Animated, Dimensions, StyleSheet, View} from 'react-native';
import {tailwind} from '@tailwind';
import {
    DeliveryI,
    LocationCoordinates,
    OrderI,
    OrderStatus,
    SOCKET_MESSAGE,
    TravelDistanceResult
} from '@nanahq/sticky';
import RestaurantIcon from '@assets/app/restaurant-1.png'
import DeliveryIcon from '@assets/app/delivery.png'
import HomeIcon from '@assets/app/home.png'
import MapView, {Marker, PROVIDER_GOOGLE, Region} from 'react-native-maps'
import {socket, useWebSocket} from "@contexts/SocketProvider";
import {useExpoPushNotification} from "@hooks/useExpoNotification";
import moment from "moment";
import * as Notifications from 'expo-notifications'
import { Audio } from 'expo-av';
import {Sound} from "expo-av/build/Audio/Sound";
function calculateDeltas(point1: [number, number], point2: [number, number]): Region {
    const toRadians = (deg: number) => deg * (Math.PI / 180);

    const lat1 = toRadians(point1[0]);
    const lat2 = toRadians(point1[1]);
    const lon1 = toRadians(point2[0]);
    const lon2 = toRadians(point2[1]);


    const latitudeDelta = Math.abs((lat2 - lat1) / 2);
    const longitudeDelta = Math.abs((lon2 - lon1) / 2);

    return { latitudeDelta, longitudeDelta, latitude: point1[0], longitude: point1[1] };
}

function coordinatedMapper(point1: LocationCoordinates, point2: LocationCoordinates): Array<{ latitude: number, longitude: number }> {
    return [
        { latitude: point1.coordinates[0], longitude: point1.coordinates[1] },
        { latitude: point2.coordinates[0], longitude: point2.coordinates[1] },
    ]
}

const { height: SCREEN_HEIGHT  } = Dimensions.get("window");

export const Map: React.FC<{ order: OrderI, delivery: DeliveryI }> = ({ order, delivery }) => {
    const mapRef = useRef<MapView | null>(null)
    const [currentDeliveryPosition, setCurrentDeliveryPosition] = useState<LocationCoordinates>(delivery.driver.location)
    const [coords, setCoords] = useState<Array<{ latitude: number, longitude: number }>>(coordinatedMapper(delivery.pickupLocation, delivery.dropOffLocation))
    const { isConnected } = useWebSocket()
    const [_, setRemainingTime] = useState<number | undefined>(calculateRemainingTime(delivery?.travelMeta?.travelTime ?? 0));
    const { schedulePushNotification } = useExpoPushNotification()
    const [_sound, setSound] = useState<Sound | null>(null);

    async function playSound() {
        const { sound } = await Audio.Sound.createAsync( require('../../../../../../../assets/sounds/notification_1.wav')
        );
        setSound(sound);
        await sound.playAsync();
    }

    useEffect(() => {
        return _sound !== null
            ? () => {
                _sound?.unloadAsync();
            }
            : undefined;
    }, [_sound]);

    useEffect(() => {
        if (delivery?.deliveryTime !== undefined) {
            const intervalId = setInterval(() => {
                setRemainingTime(calculateRemainingTime(delivery?.travelMeta?.travelTime as any));
            }, 1000);
            return () => clearInterval(intervalId);
        }
    }, [delivery?.deliveryTime]);


    function calculateRemainingTime(targetTime: number): number {
        const currentTime = moment(delivery?.order?.updatedAt);
        const endTime = moment(delivery?.order?.updatedAt).add(targetTime, 'minutes');
        const duration = moment.duration(endTime.diff(currentTime));

        const remainingMinutes = duration.asMinutes();

        return Math.max(0, Math.round(remainingMinutes));
    }

    useEffect(() => {
        if (isConnected) {
            socket?.on(SOCKET_MESSAGE.DRIVER_LOCATION_UPDATED, (message: { deliveryId: string, location: LocationCoordinates, travelMeta?: TravelDistanceResult }) => {
             console.log('Socket message delivery room', message.deliveryId.toString() === delivery?._id.toString())
                if (message.deliveryId.toString() === delivery?._id.toString()) {
                    setCurrentDeliveryPosition(message.location)
                }
            });

            socket?.on(SOCKET_MESSAGE.UPDATE_ORDER_STATUS, (message: { userId: string, orderId: string, status: OrderStatus, driver: string, vendorName?: string }) => {
                const isOrder = message.orderId === order._id
                if (isOrder) {
                    const notificationPayload: Notifications.NotificationRequestInput = {
                        trigger: {
                            seconds: 1,
                            repeats: false
                        },
                        identifier: OrderStatus.IN_ROUTE,
                        content: {
                            sticky: false,
                            title: order.vendor.businessName,
                            body: 'Your order is delivered enjoy your meal',
                            sound: 'default',
                            data: {
                                order
                            }
                        }
                    }
                    switch (message.status) {
                        case OrderStatus.IN_ROUTE:
                            void playSound()
                            break;
                        case OrderStatus.FULFILLED:
                            void Notifications.getPermissionsAsync()
                            void schedulePushNotification(notificationPayload)
                            break;
                        default:
                    }
                }
            })
        }
    }, [isConnected]);

    useEffect(() => {
        mapRef.current?.fitToCoordinates(coords, {
            edgePadding:{top:450,right:50,left:50,bottom:350},
            animated:true
        });
    }, [])

    useEffect(() => {
        mapRef?.current?.animateToRegion(calculateDeltas(delivery?.pickupLocation?.coordinates ?? [0,0], delivery.dropOffLocation.coordinates))
    }, [])

    console.log(currentDeliveryPosition)

    return (
        <View style={tailwind('flex-1 bg-white flex flex-col  justify-center')}>
            <View style={[tailwind('w-full'), { width: '100%', height: SCREEN_HEIGHT / 2 }]}>
                <MapView
                    customMapStyle={mapStyle}
                    ref={mapRef}
                    style={{ width: '100%', height: '100%' }}
                    provider={PROVIDER_GOOGLE}
                    region={calculateDeltas(delivery.pickupLocation.coordinates,  delivery.dropOffLocation.coordinates)}
                >
                    <Marker
                        key={delivery._id}
                        coordinate={{
                            latitude: delivery.pickupLocation.coordinates[0],
                            longitude: delivery.pickupLocation.coordinates[1],
                        }}
                    >
                        <Animated.View style={style.markerWrap}>
                            <Animated.Image
                                source={RestaurantIcon}
                                style={style.marker}
                                resizeMode="cover"

                            />
                            <Animated.Text style={[tailwind('text-white'), {fontSize: 10}]}>
                                {order.vendor.businessName}
                            </Animated.Text>
                        </Animated.View>
                    </Marker>

                    <Marker
                        coordinate={{
                            latitude: delivery.dropOffLocation.coordinates[0],
                            longitude: delivery.dropOffLocation.coordinates[1],
                        }}
                    >
                        <Animated.View style={style.markerWrap}>
                            <Animated.Image
                                source={HomeIcon}
                                style={style.marker}
                                resizeMode="cover"

                            />
                            <Animated.Text style={[tailwind('text-white '), {fontSize: 10}]}>
                                Delivery Address
                            </Animated.Text>
                        </Animated.View>
                    </Marker>
                    {delivery.assignedToDriver && (
                        <Marker
                            coordinate={{
                                latitude: currentDeliveryPosition.coordinates[0],
                                longitude: currentDeliveryPosition.coordinates[1],
                            }}
                        >
                            <Animated.View style={style.markerWrap}>
                                <Animated.Image
                                    source={DeliveryIcon}
                                    style={style.marker}
                                    resizeMode="cover"

                                />
                            </Animated.View>
                        </Marker>
                    )}
                </MapView>
            </View>
        </View>
    );
};


const mapStyle = [
    {
        elementType: "geometry",
        stylers: [
            {
                color: "#212121",
            },
        ],
    },
    {
        elementType: "geometry.fill",
        stylers: [
            {
                saturation: -5,
            },
            {
                lightness: -5,
            },
        ],
    },
    {
        elementType: "labels.icon",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#212121",
            },
        ],
    },
    {
        featureType: "administrative",
        elementType: "geometry",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "administrative.country",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#9E9E9E",
            },
        ],
    },
    {
        featureType: "administrative.land_parcel",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "administrative.locality",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#BDBDBD",
            },
        ],
    },
    {
        featureType: "poi",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "poi.business",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "geometry",
        stylers: [
            {
                color: "#181818",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text",
        stylers: [
            {
                visibility: "off",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#616161",
            },
        ],
    },
    {
        featureType: "poi.park",
        elementType: "labels.text.stroke",
        stylers: [
            {
                color: "#1B1B1B",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "geometry",
        stylers: [
            {
                visibility: "on", // Changed from "off" to "on"
            },
        ],
    },
    {
        featureType: "road",
        elementType: "geometry.fill",
        stylers: [
            {
                color: "#2C2C2C",
            },
        ],
    },
    {
        featureType: "road",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#8A8A8A",
            },
        ],
    },
    {
        featureType: "road.arterial",
        elementType: "geometry",
        stylers: [
            {
                color: "#373737",
            },
        ],
    },
    {
        featureType: "road.highway",
        elementType: "geometry",
        stylers: [
            {
                color: "#3C3C3C",
            },
        ],
    },
    {
        featureType: "road.highway.controlled_access",
        elementType: "geometry",
        stylers: [
            {
                color: "#4E4E4E",
            },
        ],
    },
    {
        featureType: "road.local",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#616161",
            },
        ],
    },
    {
        featureType: "transit",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#757575",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "geometry",
        stylers: [
            {
                color: "#000000",
            },
        ],
    },
    {
        featureType: "water",
        elementType: "labels.text.fill",
        stylers: [
            {
                color: "#3D3D3D",
            },
        ],
    },
];

const style = StyleSheet.create({
    marker: {
        height: 30,
        width: 30,
    },
    markerWrap: {
        alignItems: "center",
        height:50,
        justifyContent: "center",
        width:50,
    }
})
