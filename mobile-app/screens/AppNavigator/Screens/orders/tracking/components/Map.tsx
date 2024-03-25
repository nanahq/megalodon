import React, {memo, useEffect, useRef, useState} from 'react';
import {View, Dimensions} from 'react-native';
import {getColor, tailwind} from '@tailwind';
import {
    DeliveryI,
    LocationCoordinates,
    OrderI,
    OrderStatus,
    SOCKET_MESSAGE,
    TravelDistanceResult
} from '@nanahq/sticky';
import {useWebSocket} from "@contexts/SocketProvider";
import moment from "moment";
import * as Notifications from "expo-notifications";
import {useExpoPushNotification} from "@hooks/useExpoNotification";
import Mapview, {Polyline, PROVIDER_GOOGLE} from 'react-native-maps'
import {mapboxLocationMapper} from "../../../../../../../utils/mapboxLocationMappper";


function calculateDeltas(point1: LocationCoordinates, point2: LocationCoordinates): { latitudeDelta: number; longitudeDelta: number } {
    const latitudeDelta = Math.abs(point1.coordinates[0] - point2.coordinates[0]);
    const longitudeDelta = Math.abs(point1.coordinates[1] - point2.coordinates[1]);
    return { latitudeDelta, longitudeDelta };
}

function coordinatedMapper (point1: LocationCoordinates, point2: LocationCoordinates): Array<{latitude: number, longitude: number}> {
    return [
        {latitude: point1.coordinates[0], longitude: point1.coordinates[1]},
        {latitude: point2.coordinates[0], longitude: point2.coordinates[1]},
    ]
}

const SCREEN_HEIGHT = Dimensions.get('window').height

 const _Map: React.FC<{ order: OrderI, delivery: DeliveryI }> = ({ order, delivery }) => {
     const {socketClient, isConnected} = useWebSocket()

     const [currentDeliveryPosition, setCurrentDeliveryPosition] = useState<[number, number]>(delivery.driver.location.coordinates)
     const [coords, setCoords] = useState(coordinatedMapper(delivery.pickupLocation, delivery.dropOffLocation))
     const [_, setRemainingTime] = useState<number | null>(delivery !== null ? calculateRemainingTime(delivery?.travelMeta?.travelTime as any) : null);
     const {schedulePushNotification} = useExpoPushNotification()

     const mapRef = useRef<any>()

     console.log(coords)

     useEffect(() => {
         mapRef.current.fitToCoordinates(coords, {
             edgePadding: {
                 top: 20,
                 right: 20,
                 bottom: 20,
                 left: 20,
             },
         });
     }, [])
     useEffect(() => {
         if (delivery?.deliveryTime !== null) {
             const intervalId = setInterval(() => {
                 setRemainingTime(calculateRemainingTime(delivery?.travelMeta?.travelTime as any));
             }, 1000);

             // Cleanup interval on component unmount
             return () => clearInterval(intervalId);
         }
     }, [delivery?.deliveryTime]);

     function calculateRemainingTime(targetTime: number): number {
         const currentTime = moment(delivery?.order.updatedAt);
         const endTime = moment(delivery?.order.updatedAt).add(targetTime, 'minutes');
         const duration = moment.duration(endTime.diff(currentTime));

         const remainingMinutes = duration.asMinutes();

         return Math.max(0, Math.round(remainingMinutes));
     }
    useEffect(() => {
        if (socketClient !== undefined && isConnected) {
            socketClient?.on(SOCKET_MESSAGE.DRIVER_LOCATION_UPDATED, (message: { deliveryId: string, location: LocationCoordinates, travelMeta?: TravelDistanceResult}) => {
                if (message.deliveryId === delivery?._id) {
                    setCurrentDeliveryPosition(message.location.coordinates)
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


    return (
        <View style={tailwind('flex-1 bg-white flex flex-col items-center justify-center')}>
            <View style={[tailwind('w-full'), {width: '100%', height: SCREEN_HEIGHT / 2}]}>
                <Mapview
                    ref={mapRef}
                    style={{width: '100%', height: '100%'}}
                    provider={PROVIDER_GOOGLE}
                >
                    <Polyline coordinates={coords} strokeWidth={4} strokeColor={getColor('primary-500')} />
                </Mapview>
            </View>
        </View>
    );
};


 export const Map = memo(_Map)
