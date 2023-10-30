import React, {useState} from "react";
import {View} from "react-native";
import {tailwind} from "@tailwind";
import {LocationAnimation} from "@screens/AppNavigator/components/LocationAnimation";
import { showTost} from "@components/commons/Toast";
import * as Location from "expo-location";
import { useAppDispatch} from "@store/index";
import {fetchProfile} from "@store/profile.reducer";
import {LocationCoordinates, UpdateUserDto} from "@nanahq/sticky";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {_api} from "@api/_request";
import {useToast} from "react-native-toast-notifications";

export function LocationPermission (): JSX.Element {
    const dispatch = useAppDispatch()
    const [loading, setLoading] = useState<boolean>(false)
    const toast = useToast()
    const requestLocation = async () => {
        setLoading(true)
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            showTost(toast, 'Permission denied', 'error')
        }
        const {coords: {longitude, latitude}} = await Location.getCurrentPositionAsync({
            accuracy: 6
        });

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
            showTost(toast, 'Location updated!', 'success')
            dispatch(fetchProfile())
        } catch (error: any) {
            showTost(toast, typeof error.message !== 'string' ? error.message[0] : error.message, 'error')

        } finally {
            setLoading(false)
        }
    }

    return (
        <View style={tailwind('flex-1 bg-white py-12')}>
          <View >
            <LocationAnimation />
              <View style={tailwind('px-7 mt-10')}>
                  <GenericButton
                      loading={loading}
                      labelColor={tailwind('text-white')}
                      onPress={requestLocation}
                      label='Share Location'
                      // style={tailwind('mt-28 px-10')}
                      backgroundColor={tailwind("bg-primary-500")} testId=""
                  />
              </View>

          </View>
        </View>
    )
}
