import {Dimensions, Image, Pressable, ScrollView, Text, View, Alert} from "react-native";
import {getColor, tailwind} from "@tailwind";
import React, {useState, useRef, useEffect} from "react";

import {useLocation} from "@contexts/location.provider";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
import Courier from "@assets/app/courier-icon.png";
import SendCourier from "@assets/app/send-courier.png";
import Checkbox from "expo-checkbox";

import {PlacesInput} from "@screens/AppNavigator/Screens/home/components/auto-complete-input";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useLoading} from "@contexts/loading.provider";
import {_api} from "@api/_request";
import {DeliveryFeeResult} from "@nanahq/sticky";
import {CourierModal} from "@screens/AppNavigator/Screens/home/components/Courier-fee-modal";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppParamList} from "@screens/AppNavigator/AppNav";
export const COURIER_FEE_MODAL = 'COURIER_FEE_MODAL'

interface DeliveryLocation {
    address: string;
    latitude: number;
    longitude: number;
    locality?: string;
}

export const CourierScreen: React.FC = () => {
    const navigator = useNavigation<NavigationProp<AppParamList>>()
    const { height, width } = Dimensions.get("window");
    const [deliveryType, setDeliveryType] = useState<"SEND" | "RECEIVE" | undefined>(undefined);
    const { isWithinSupportedCities } = useLocation();


    if (!isWithinSupportedCities) {
        return <NotfoundLocation />;
    }

    const formattedWidth = width - 60;

    useEffect(() => {
        setDeliveryType(undefined)

    },[])

    useEffect(() => {
        if(deliveryType !== undefined) {
            navigator.navigate(ModalScreenName.MODAL_BOX_SCREEN, {
                deliveryType
            } as any)
        }
    }, [deliveryType])

    return (
        <View style={tailwind('flex-1 bg-white pt-4 px-4')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height}}
            >
                <View style={tailwind('my-10')}>
                    <Text style={tailwind('w-4/5 text-lg font-bold')}>Send or receive a package from point A to point B</Text>
                </View>
                <View style={[tailwind('flex flex-col  p-2 mt-5'), {}]}>
                    <Text style={tailwind('font-normal text-slate-900 mb-5')}>Select delivery type to get started </Text>
                    <View style={tailwind('flex flex-row w-full justify-between')}>
                        <Pressable
                            style={[tailwind('rounded-xl bg-primary-50 p-3', {'bg-primary-100 border-2 border-primary-100' : deliveryType === 'SEND'}), {  height: 150, width: formattedWidth  / 2}]}
                            onPress={() => setDeliveryType('SEND')}
                        >
                            <Text style={tailwind('text-black font-bold text-lg w-4/5', {'text-white':  deliveryType === 'SEND'})}>Send a package</Text>
                            <Image
                                resizeMode="cover"
                                style={[tailwind('bottom-0 right-0 absolute'), {
                                    width:formattedWidth / 4,
                                    height:75
                                }]}
                                source={SendCourier}

                            />
                        </Pressable>
                        <Pressable
                            onPress={() => setDeliveryType('RECEIVE')}
                            style={[tailwind('rounded-xl bg-primary-50 p-3', {'bg-primary-100 border-2 border-primary-100' : deliveryType === 'RECEIVE'}), {  height: 150, width: formattedWidth  / 2}]}
                        >
                            <Text style={tailwind('text-black font-bold text-lg w-4/5', {'text-white':  deliveryType === 'RECEIVE'})}>Receive a package</Text>
                            <Image
                                resizeMode="cover"
                                style={[tailwind('bottom-0 right-0 absolute'), {
                                    width:formattedWidth / 4,
                                    height:75
                                }]}
                                source={Courier}
                            />
                        </Pressable>
                    </View>
                </View>
            </ScrollView>
        </View>
    )
}
