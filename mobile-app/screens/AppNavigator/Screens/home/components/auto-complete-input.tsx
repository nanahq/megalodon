import { GenericTextInput } from "@components/commons/inputs/TextInput";
import {Alert, View} from "react-native";
import {tailwind} from "@tailwind";
import {GooglePlacesAutocomplete} from "react-native-google-places-autocomplete";
import {useState} from "react";

interface DeliveryLocation {
    address: string;
    latitude: number;
    longitude: number;
    locality?: string;

    description: string
}
const extractLocality = (addressComponents: any[]) => {
    const localityComponent = addressComponents.find(
        component => component.types.includes('locality') ||
            component.types.includes('administrative_area_level_1')
    );
    return localityComponent ? localityComponent.long_name : undefined;
};
export const PlacesInput = ({
                         placeholder,
                         onLocationSelect,
    onAddressChange
                     }: {
    placeholder: string,
    onLocationSelect: (details: DeliveryLocation) => void,
    onAddressChange?: (text: string) => void
}) => {
    const [addressText, setAddressText] = useState('');

    return (
        <View>
            <GooglePlacesAutocomplete
              textInputProps={{onChangeText: (text) => {
                     if(onAddressChange !== undefined) {
                         onAddressChange(text)
                     }
                  }}}
                placeholder={placeholder}
                fetchDetails={true}
                onPress={(data, details = null) => {
                    if (details) {
                        const locality = extractLocality(details.address_components);

                        if (!locality) {
                            Alert.alert(
                                "Invalid Location",
                                "Please select a more specific location with a recognizable city or region."
                            );
                            return;
                        }

                        // Update the address text
                        setAddressText(data.description);

                        // Call location selection
                        onLocationSelect({
                            address: data.description,
                            latitude: details.geometry.location.lat,
                            longitude: details.geometry.location.lng,
                            locality: locality,
                            description: data.description
                        });
                    }
                }}
                query={{
                    key: 'AIzaSyBjFkN1A1PHGRRDK9EejYcQOQxtO-piDRA',
                    language: "en",
                    components: "country:ng",
                }}
                styles={{
                    listView: tailwind("bg-white"),
                    separator: tailwind('hidden'),
                    description: tailwind('flex text-base text-slate-500'),
                    row: tailwind('my-1 border-0 text-lg'),
                    textInput: tailwind('rounded-lg border-1.5 border-gray-200 font-normal h-14  flex w-full items-center px-3 py-3.5 text-slate-900 text-base'),
                }}

                enablePoweredByContainer={false}

            />
        </View>
    );
};

