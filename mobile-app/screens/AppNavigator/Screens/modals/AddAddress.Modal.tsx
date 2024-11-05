import {View, Text, TouchableOpacity, ActivityIndicator, ScrollView} from "react-native";
import {getColor, tailwind} from "@tailwind";
import React, {useEffect, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {StackScreenProps} from "@react-navigation/stack";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import * as Location from "expo-location";
import {showTost} from "@components/commons/Toast";
import {useToast} from "react-native-toast-notifications";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ProfileParamsList} from "@screens/AppNavigator/Screens/profile/ProfileNavigator";
import {_api} from "@api/_request";
import {useAnalytics} from "@segment/analytics-react-native";

import {mapboxLocationMapper} from "../../../../../utils/mapboxLocationMappper";
import {useAddress} from "@contexts/address-book.provider";
import {AddressBookDto} from "@nanahq/sticky";
import {mutate} from "swr";
import {useLoading} from "@contexts/loading.provider";

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

    house_number: string
}
export const AddAddressModal: React.FC<AddAddressModalProps> = ({navigation, route}) => {
    const {addressLabels, addingAddress} = useAddress()
    const profileNavigation = useNavigation<NavigationProp<ProfileParamsList>>()
    const [newAddress, setNewAddress] = useState<NewAddress>({
        labelName: '',
        labelId: '',
        address: '',
        house_number: '',
        coordinates: [0, 0]
    })

    const [gettingLocation, setGettingLocation] = useState<boolean>(false)
    const [errors, setErrors] = useState<any>({
        labelName: false,
        labelId: false,
        address: false,
        coordinates: false,
        house_number: false,
    })

    const toast = useToast()
    const analytics = useAnalytics()
    const {setLoadingState} = useLoading()

    useEffect(() => {
        void analytics.screen(ModalScreenName.MODAL_ADD_ADDRESS_SCREEN)
    }, [])

    useEffect(() => {
        handleUpdateForm('labelId', addressLabels.find(l => l.name.toLowerCase() === 'home')?._id ?? '')
    }, [addressLabels])


    const handleUpdateForm = (name: keyof NewAddress , value: any) : void => {
        setErrors({
            labelName: false,
            labelId: false,
            address: false,
            coordinates: false,
            house_number: false
        })
        setNewAddress((prevState) => ({...prevState, [name]: value}))
    }


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'Add new address',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-2xl font-bold  text-slate-900'),
            headerLeft: () => <ModalCloseIcon size={18} onPress={() => profileNavigation.goBack()} />,
        })
    }, [])
    const handleAddNewAddress =  async () => {
        setErrors({
            labelName: false,
            labelId: false,
            address: false,
            coordinates: false,
            house_number: false
        })

        if (newAddress.address === ''){
            setErrors((prevState: any) => ({...prevState, address: 'Address can not be empty'}))
            return
        }

        if (newAddress.house_number === ''){
            setErrors((prevState: any) => ({...prevState, address: 'Please add an identifier. Example Street name, gate color or estate name'}))
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

        const {coordinates, house_number, ...rest} = newAddress

        console.log({...rest, location: {coordinates}})
        try {
            setLoadingState(true)
            await _api.requestData<AddressBookDto>({
                method: 'post',
                url: 'address-books',
                data: {...rest, location: {coordinates}}
            } as any)
            setTimeout(() => {
                if (route?.params?.callback !== undefined) {
                    route?.params?.callback()
                }
            }, 2000)

            void analytics.track('CLICK:ADD-NEW-ADDRESS')
            void mutate('address-books')
            showTost(toast, 'Address saved!', 'success')
        } catch (error) {
            console.log(error)
            showTost(toast, 'Failed to save address', 'error')
        } finally {
            setLoadingState(false)
        }

    }

    const requestCurrentLocation = async () => {
        setGettingLocation(true)
        setErrors({
            labelName: false,
            labelId: false,
            address: false,
            coordinates: false,
            house_number: false
        })
        const { status } = await Location.requestForegroundPermissionsAsync();

        if (status !== 'granted') {
            showTost(toast, 'We can not get permission. Please go to settings and give Nana location access', 'error')
            setGettingLocation(false)

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
        const MAPBOX_TOKEN =  process.env.EXPO_PUBLIC_MAPBOX_TOKEN ??  "pk.eyJ1Ijoic3VyYWphdXdhbCIsImEiOiJjbTJ6d3Y3ZDkwZml2MmtzNzZ4ODNkejc1In0.gQYN5B1HIFdJhpwv3Hyeqw"

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
        <ScrollView style={tailwind('flex-1 h-full bg-white px-4 pt-4 relative')}>
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
                <View style={tailwind('mb-6')}>
                    <TextInputWithLabel
                        editable={true}
                        label="Address identifier"
                        moreInfo="House number, estate name or street name. Any identifier to help us locate this address"
                        containerStyle={tailwind('mt-2.5 overflow-hidden')}
                        textAlign='left'
                        onChangeText={(value) => handleUpdateForm('house_number', value) }
                        value={`${newAddress.house_number}`}
                        placeholder="Gidan su ummi, Layin mallam musa, Al- wa'a estate ETC"
                        placeHolderStyle="#717171"
                    />
                    {errors.address !== false && (
                        <Text style={tailwind('text-red-500 mt-1')}>{errors.hous}</Text>
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
                                    'border-primary-100': label._id === newAddress.labelId
                                })} onPress={() => handleUpdateForm('labelId', label._id)}>
                                    <Text >{label.name}</Text>
                                    <View
                                        style={tailwind('rounded-full w-2 h-2 absolute bottom-1 right-1', {
                                            'bg-primary-100': label._id === newAddress.labelId,
                                            'border-0.5 border-primary-50': label._id !== newAddress.labelId
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
                <GenericButton loading={addingAddress} onPress={handleAddNewAddress} label="Add address" backgroundColor={tailwind('bg-primary-100')} labelColor={tailwind('text-white font-medium')} />
            </View>
        </ScrollView>
    )
}


function extractAddress(mapboxResponse: MapboxResponse): string | undefined {
    if (mapboxResponse.features && mapboxResponse.features.length > 0) {
        const primaryFeature = mapboxResponse.features[0];
        if (primaryFeature.place_name) {
            return primaryFeature.place_name.split(',').slice(1).join(',').trim();
        }
    }

    return undefined as any;
}
