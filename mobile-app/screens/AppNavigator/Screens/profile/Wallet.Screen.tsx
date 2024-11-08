import {Pressable, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {useToast} from "react-native-toast-notifications";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import React, {useCallback, useEffect, useRef} from "react";
import {ModalBackIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {NumericFormat as NumberFormat} from "react-number-format";
import {IconButton} from "@components/commons/buttons/IconButton";
import * as ClipBoard from "expo-clipboard";
import {showTost} from "@components/commons/Toast";
import {IconComponent} from "@components/commons/IconComponent";
import {AddMoneyModal} from "@screens/AppNavigator/Screens/profile/components/AddMoneyModal";
import {useProfile} from "@contexts/profile.provider";


const ADD_MONEY_MODAL = 'ADD_MONEY_MODAL'
export const WalletScreen = () => {
    const {profile} = useProfile()
    const toast = useToast()
    const modalRef = useRef<any>()


    const navigation = useNavigation<NavigationProp<AppParamList>>()
    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <ModalBackIcon onPress={() => navigation.goBack()} />,
        })
    }, [])
    const copy = async (text: string): Promise<void> => {
        await ClipBoard.setStringAsync(String(text))
        showTost(toast, 'Account number copied', 'success')
    }


    const handleOpenModal = useCallback(() => {
        modalRef.current.present()
    }, [])




    return (
        <View style={tailwind('flex-1 bg-white px-4')}>
            <View style={tailwind('mt-5')}>
                <View style={tailwind('bg-brand-black-500  w-full rounded-lg py-4 px-3 ')}>
                    <View style={tailwind('flex flex-col w-full')}>
                        <Text style={tailwind('text-sm text-white mb-5')}>Available Balance</Text>
                        <NumberFormat
                            prefix="₦ "
                            value=" 0.00"
                            thousandSeparator
                            displayType="text"
                            renderText={(value) => (
                                <Text style={tailwind("font-normal text-4xl text-white")}>{value}</Text>
                            )}
                        />
                        <Pressable onPress={() => handleOpenModal()} style={tailwind('bg-white flex-row justify-center w-1/3 rounded-lg self-end  mt-5')}>
                            <View style={tailwind('py-2 flex flex-row items-center')}>
                                <Text style={tailwind(' mr-1')}>Add money</Text>
                                <IconComponent iconType="AntDesign" name="pluscircleo" size={20}/>
                            </View>
                        </Pressable>
                    </View>
                </View>
                <View style={tailwind('flex flex-col mt-5')} />
                <View style={tailwind('flex flex-row items-center')} >
                        <Text style={tailwind('w-2/5 text-xs')} numberOfLines={3}>Add money to wallet with your Nana's bank Account</Text>
                    <View style={tailwind('flex flex-row items-center justify-center w-3/5')}>
                        <Pressable onPress={() => copy(profile.paystack_titan ?? '')} style={tailwind('bg-nana-lime px-3 py-1.5 rounded-lg')}>
                            <View style={tailwind('flex flex-row items-center justify-between')}>
                                <View style={tailwind('flex flex-col')}>
                                    <Text style={tailwind('text-white')}>Paystack-Titan</Text>
                                    <Text style={tailwind('text-white text-lg font-bold')}>{profile.paystack_titan}</Text>
                                </View>
                                <View style={tailwind('flex flex-row items-center pl-2')}>
                                    <Text style={tailwind('text-white')}> Copy</Text>
                                    <IconButton iconName="copy" iconType="Feather"  iconStyle={tailwind('text-white')} iconSize={16} />
                                </View>
                            </View>
                        </Pressable>
                    </View>
                </View>
            </View>
            <AddMoneyModal
                accountNumber={profile.paystack_titan ?? ''}
                promptModalName={ADD_MONEY_MODAL}
                modalRef={modalRef}
            />
        </View>
    )
}
