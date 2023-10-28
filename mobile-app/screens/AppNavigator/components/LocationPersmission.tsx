import React from "react";
import {View} from "react-native";
import {tailwind} from "@tailwind";
import {LocationAnimation} from "@screens/AppNavigator/components/LocationAnimation";
import {ShowToast} from "@components/commons/Toast";
import * as Location from "expo-location";
import { useAppDispatch} from "@store/index";
import { updateUserProfile} from "@store/profile.reducer";
import {LocationCoordinates} from "@nanahq/sticky";
import {GenericButton} from "@components/commons/buttons/GenericButton";

export function LocationPermission (): JSX.Element {
    const dispatch = useAppDispatch()
    const requestLocation = async () => {
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            ShowToast('error', 'Permission denied')
        }
        const {coords: {longitude, latitude}} = await Location.getCurrentPositionAsync({
            accuracy: 6
        });

        const location: LocationCoordinates = {
            type: 'Point',
            coordinates: [latitude, longitude]
        }
        dispatch(updateUserProfile({location}))
    }
    return (
        <View style={tailwind('flex-1 bg-white py-12')}>
          <View style={tailwind('w-full')}>
            <LocationAnimation />
              <GenericButton
                  labelColor={tailwind('text-white')}
                  onPress={requestLocation}
                  label='Share Location'
                  style={tailwind('mx-12 mt-28')}
                  backgroundColor={tailwind("bg-primary-500")} testId=""
              />
          </View>
        </View>
    )
}
