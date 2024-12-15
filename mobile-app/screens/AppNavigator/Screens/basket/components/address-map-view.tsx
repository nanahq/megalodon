import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import MapView, {
    Marker,
    PROVIDER_GOOGLE,
    Region
} from 'react-native-maps';
import * as Location from 'expo-location';

interface MapPreviewProps {
    latitude: number;
    longitude: number;
    address?: string;
    height?: number;
    onLocationSelect?: (location: {
        latitude: number;
        longitude: number;
    }) => void;
}

export const AddressMapPreview: React.FC<MapPreviewProps> = ({
                                                   latitude,
                                                   longitude,
                                                   address,
                                                   height = 250,
                                                   onLocationSelect
                                               }) => {
    const [location, setLocation] = useState<Region>({
        latitude,
        longitude,
        latitudeDelta: 0.005,
        longitudeDelta: 0.005,
    });

    const [hasLocationPermission, setHasLocationPermission] = useState(false);

    useEffect(() => {
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            setHasLocationPermission(status === 'granted');
        })();
    }, []);

    const handleRegionChangeComplete = (newRegion: Region) => {
        if (onLocationSelect) {
            onLocationSelect({
                latitude: newRegion.latitude,
                longitude: newRegion.longitude
            });
        }
    };

    if (!hasLocationPermission) {
        return (
            <View style={styles.container}>
                <Text>Location permissions are required to show the map.</Text>
            </View>
        );
    }

    return (
        <View style={[styles.container, { height }]}>
            <MapView
                style={styles.map}
                provider={PROVIDER_GOOGLE}
                region={location}
                onRegionChangeComplete={handleRegionChangeComplete}
                showsUserLocation={true}
                showsMyLocationButton={true}
            >
                <Marker
                    coordinate={{
                        latitude: location.latitude,
                        longitude: location.longitude
                    }}
                    title="Selected Location"
                    description={address || "Current Location"}
                    pinColor="red"
                />
            </MapView>
            {address && (
                <View style={styles.addressContainer}>
                    <Text
                        style={styles.addressText}
                        numberOfLines={2}
                        ellipsizeMode="tail"
                    >
                        {address}
                    </Text>
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        width: '100%',
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 10,
    },
    map: {
        width: '100%',
        height: '100%',
    },
    addressContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        backgroundColor: 'rgba(255,255,255,0.8)',
        padding: 10,
    },
    addressText: {
        fontSize: 14,
        color: '#333',
        textAlign: 'center',
    },
});

