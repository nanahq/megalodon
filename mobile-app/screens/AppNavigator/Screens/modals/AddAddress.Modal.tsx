import {View, Text, TouchableOpacity, ActivityIndicator} from "react-native";
import {getColor, tailwind} from "@tailwind";
import React, {useEffect, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {StackScreenProps} from "@react-navigation/stack";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Location from "expo-location";
import {showTost} from "@components/commons/Toast";
import {useToast} from "react-native-toast-notifications";
import {addAddressBook} from "@store/AddressBook.reducer";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {_api} from "@api/_request";
import {mapboxLocationMapper} from "../../../../../utils/mapboxLocationMappper";

type AddAddressModalProps = StackScreenProps<AppParamList, ModalScreenName.MODAL_ADD_ADDRESS_SCREEN>


interface MapboxFeature {
    id: string;
    type: string;
    place_type: string[];
    relevance: number;
    properties: {
        mapbox_id: string;
    };
    text: string;
    place_name: string;
    bbox?: number[];
    center: number[];
    geometry?: {
        type: string;
        coordinates: number[];
    };
    context?: {
        id: string;
        mapbox_id: string;
        wikidata?: string;
        short_code?: string;
        text: string;
    }[];
}

interface MapboxResponse {
    type: string;
    query: number[];
    features: MapboxFeature[];
    attribution: string;
}

interface NewAddress  {
    labelName: string
    coordinates: [number, number]
    address: string;
    labelId: string;
}
export const AddAddressModal: React.FC<AddAddressModalProps> = ({navigation, route}) => {
    const {addressLabels, addingAddress} = useAppSelector((state: RootState) => state.addressBook)
    const profileNavigation = useNavigation<NavigationProp<ProfileParamsList>>()
    const [newAddress, setNewAddress] = useState<NewAddress>({
        labelName: '',
        labelId: '',
        address: '',
        coordinates: [0, 0]
    })

    const [gettingLocation, setGettingLocation] = useState<boolean>(false)

    useEffect(() => {
        handleUpdateForm('labelId', addressLabels.find(l => l.name.toLowerCase() === 'home')?._id ?? '')
    }, [addressLabels])

    const [errors, setErrors] = useState<any>({
        labelName: false,
        labelId: false,
        address: false,
        coordinates: false
    })

    const toast = useToast()
    const dispatch = useAppDispatch()
    const handleUpdateForm = (name: keyof NewAddress , value: any) : void => {
        setErrors({
            labelName: false,
            labelId: false,
            address: false,
            coordinates: false
        })
        setNewAddress((prevState) => ({...prevState, [name]: value}))
    }


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Add new address',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            headerStyle:  {
                shadowOpacity: 8,
                shadowRadius: 12,
            },
            headerLeft: () => <ModalCloseIcon onPress={() => profileNavigation.navigate(HomeScreenName.HOME, {})} />,
        })
    }, [])
    const handleAddNewAddress =  async () => {
        setErrors({
            labelName: false,
            labelId: false,
            address: false,
            coordinates: false
        })

        if (newAddress.address === ''){
            setErrors((prevState: any) => ({...prevState, address: 'Address can not be empty'}))
            return
        }

        if (newAddress.labelId === ''){
            setErrors((prevState: any) => ({...prevState, labelId: 'Choose address type'}))
            return
        }

        if (newAddress.labelName === ''){
            setErrors((prevState: any) => ({...prevState, address: 'Address Name can not be empty'}))
            return
        }

        if (newAddress.coordinates[0] === 0){
            setErrors((prevState: any) => ({...prevState, coordinates: 'Please click use current location to get your precise location'}))
            return
        }

        const {coordinates, ...rest} = newAddress

        dispatch(addAddressBook({...rest, location: {coordinates}}))

        setTimeout(() => {
            if (route?.params?.callback !== undefined) {
                route?.params?.callback()
            }
        }, 2000)

    }

    const requestCurrentLocation = async () => {
        setGettingLocation(true)
        setErrors({
            labelName: false,
            labelId: false,
            address: false,
            coordinates: false
        })
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            showTost(toast, 'Permission denied', 'error')
            return
        }
        const {coords: {longitude, latitude}} = await Location.getCurrentPositionAsync({
            accuracy: 6
        });

        handleUpdateForm('coordinates', [latitude, longitude])


        showTost(toast, 'Precise location added', 'success')

        setGettingLocation(false)


    }

    useEffect(() => {
        void fetchDeliveryMeta()
    }, [newAddress.coordinates])

    const fetchDeliveryMeta = async () => {

        const MAPBOX_TOKEN = 'pk.eyJ1Ijoic3VyYWphdXdhbCIsImEiOiJjbGxiNHhpNW8wMHBpM2lxb215NnZmN3ZuIn0.a6zWnzIF0KcVZ2AUiDNBDA'

        const coords = mapboxLocationMapper(newAddress.coordinates, true)

        const url = `geocoding/v5/mapbox.places/${coords}.json?access_token=${MAPBOX_TOKEN}`

        const {data} = await  _api.requestData<null, MapboxResponse>({
                method: 'GET',
            baseUrl: 'https://api.mapbox.com',
            url,
        })

        const address = extractAddress(data)


        if (address !== undefined) {
            handleUpdateForm('address', address)
        }
    }
    return (
        <View style={tailwind('flex-1 bg-white px-4 pt-4 relative')}>
            <View>
                <View style={tailwind('mb-6')}>
                    <TextInputWithLabel
                        label="Name"
                        moreInfo="What name should we saved this as? For later use"
                        containerStyle={tailwind('mt-2.5 overflow-hidden')}
                        textAlign='left'
                        onChangeText={(value) => handleUpdateForm('labelName', value) }
                        value={`${newAddress.labelName }`}
                        placeholder="My House"
                        placeHolderStyle="#717171"
                    />
                    {errors.labelName !== false && (
                        <Text style={tailwind('text-red-500 mt-1')}>{errors.labelName}</Text>
                    )}
                </View>
                <View style={tailwind('flex flex-col mt-5')}>
                    <Text style={tailwind('font-medium text-sm text-brand-black-500 mb-1')}>
                        Location Points (we use precise location for delivery)
                    </Text>
                    <TouchableOpacity  style={tailwind('py-2',)} disabled={gettingLocation} onPress={requestCurrentLocation}>
                        {gettingLocation ? (
                            <ActivityIndicator size="small" color={getColor('primary-500')} />
                        ) : (
                            <Text style={tailwind('font-bold text-lg underline', {'text-brand-gray-700': gettingLocation})}>{newAddress.coordinates[0] === 0 ? 'Use current Location' : 'We have this location'}</Text>
                        )}
                    </TouchableOpacity>
                    {errors.coordinates !== false && (
                        <Text style={tailwind('text-red-500 mt-1')}>{errors.coordinates}</Text>
                    )}
                </View>
               <View style={tailwind('mb-6')}>
                   <TextInputWithLabel
                       editable={false}
                       label="Address"
                       containerStyle={tailwind('mt-2.5 overflow-hidden')}
                       textAlign='left'
                       onChangeText={(value) => handleUpdateForm('address', value) }
                       value={`${newAddress.address}`}
                       placeholder="Ummi Plaza Zoo road"
                       placeHolderStyle="#717171"
                   />
                   {errors.address !== false && (
                       <Text style={tailwind('text-red-500 mt-1')}>{errors.address}</Text>
                   )}
               </View>
                {addressLabels.length > 0 && (
                    <View style={tailwind('flex flex-col my-5')}>
                        <Text style={tailwind('font-medium text-sm text-brand-black-500 mb-5')}>
                            What type of address is this?
                        </Text>
                        <View style={tailwind('flex flex-row flex-wrap items-center w-full')}>
                            {addressLabels?.map((label, index) => (
                                <TouchableOpacity key={index} style={tailwind('w-28  mb-2 flex flex-row items-center justify-center border-brand-gray-400 rounded-sm  border-0.5 py-2 px-1 mr-1 relative', {
                                    'border-primary-800': label._id === newAddress.labelId
                                })} onPress={() => handleUpdateForm('labelId', label._id)}>
                                    <Text >{label.name}</Text>
                                    <View
                                        style={tailwind('rounded-full w-2 h-2 absolute bottom-1 right-1', {
                                            'bg-primary-500': label._id === newAddress.labelId,
                                            'border-0.5 border-brand-gray-400': label._id !== newAddress.labelId
                                        })}
                                    />
                                </TouchableOpacity>
                            ))}
                        </View>
                        {errors.labelId !== false && (
                            <Text style={tailwind('text-red-500 mt-1')}>{errors.labelId}</Text>
                        )}
                    </View>
                )}
                <GenericButton loading={addingAddress} onPress={handleAddNewAddress} label="Add address" backgroundColor={tailwind('bg-black')} labelColor={tailwind('text-white font-medium')} />
            </View>
        </View>
    )
}


function extractAddress(mapboxResponse: MapboxResponse): string | undefined {
    if (mapboxResponse.features && mapboxResponse.features.length > 0) {
        const primaryFeature = mapboxResponse.features[0];
        if (primaryFeature.place_name) {
            // Remove state and country from the address
            const addressParts = primaryFeature.place_name.split(',').slice(0, -2).slice(1).join(',').trim();
            return addressParts;
        }
    }

    return undefined;
}
