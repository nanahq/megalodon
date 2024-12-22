import {Dimensions, Image, Pressable, ScrollView, Text, View} from "react-native";
import { tailwind} from "@tailwind";
import React, {useState, useRef, useEffect} from "react";

import {useLocation} from "@contexts/location.provider";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
import Courier from "@assets/app/send-icon.png";
import SendCourier from "@assets/app/courier-icon.png";

import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import BoxDP from "@assets/app-config/Box.png";

const HeaderCenter = () => (
    <View style={tailwind('flex flex-row items-center')}>
        <Image source={BoxDP} style={tailwind('w-28 h-14')} resizeMode="contain" width={100} height={40} />
    </View>
);
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
        navigator.setOptions({
            headerShown: true,
            headerTitleAlign: 'center',
            headerStyle: {
                height: 120,
                backgroundColor: 'white',
                shadowColor: '#000',
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 3.84,
                elevation: 5,
            },
            headerTitle: () => <HeaderCenter />,
        })
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
