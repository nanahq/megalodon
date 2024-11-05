import React, {useState} from "react";
import {View} from "react-native";
import {tailwind} from "@tailwind";
import {LocationAnimation} from "@screens/AppNavigator/components/LocationAnimation";
import { showTost} from "@components/commons/Toast";
import * as Location from "expo-location";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {useToast} from "react-native-toast-notifications";
import {useLocation} from "@contexts/location.provider";
export function LocationPermission (): JSX.Element {
    const [loading, setLoading] = useState<boolean>(false)
    const {updateInterimLocationStatus} = useLocation()
    const toast = useToast()
    const requestLocation = async () => {
        setLoading(true)
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            showTost(toast, 'Permission denied', 'error')
        }
        updateInterimLocationStatus(status)
        setLoading(false)
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
                      backgroundColor={tailwind("bg-primary-100")} testId=""
                  />
              </View>

          </View>
        </View>
    )
}
