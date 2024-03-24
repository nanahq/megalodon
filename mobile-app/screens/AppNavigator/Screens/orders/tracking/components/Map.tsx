import React, {memo, useEffect, useState} from 'react';
import {View, Dimensions} from 'react-native';
import { tailwind} from '@tailwind';
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
import Mapview, {PROVIDER_GOOGLE} from 'react-native-maps'
import {mapboxLocationMapper} from "../../../../../../../utils/mapboxLocationMappper";


const SCREEN_HEIGHT = Dimensions.get('window').height

 const _Map: React.FC<{ order: OrderI, delivery: DeliveryI }> = ({ order, delivery }) => {
    const [ setPlaces] = useState<any>(null);
    const {socketClient, isConnected} = useWebSocket()

     const [_, setRemainingTime] = useState<number | null>(delivery !== null ? calculateRemainingTime(delivery?.travelMeta?.travelTime as any) : null);
     const {schedulePushNotification} = useExpoPushNotification()

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
                    setPlaces(() => {
                        return {
                            type: 'FeatureCollection',
                            features: [
                                {
                                    type: 'Feature',
                                    properties: {
                                        description: mapboxLocationMapper(delivery?.order?.deliveryAddress as any),
                                        icon: 'marker',

                                    },
                                    geometry: {
                                        type: 'Point',
                                        coordinates: mapboxLocationMapper(delivery.dropOffLocation.coordinates as any),
                                    },
                                },
                            ],
                        };
                    });
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

    function checkForNullishCoords (coord: [number, number] | null): boolean {
        if (coord === null) {
        return true
        } else if (coord[0] + coord[1] < 1) {
            return true
        }
        return false
    }



    return (
        <View style={tailwind('flex-1 bg-white flex flex-col items-center justify-center')}>
            <View style={[tailwind('w-full'), {width: '100%', height: SCREEN_HEIGHT / 2}]}>
                <Mapview style={{width: '100%', height: '100%'}}  provider={PROVIDER_GOOGLE} />
            </View>
        </View>
    );
};


 export const Map = memo(_Map)
