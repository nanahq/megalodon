import {Pressable, ScrollView, Text, View, Modal} from "react-native";
import React, {useEffect, useState} from "react";
import { tailwind } from "@tailwind";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import { ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {useLoading} from "@contexts/loading.provider";
import {useAddress} from "@contexts/address-book.provider";
import {Building, Trash} from "lucide-react-native";
import {MultiShare} from "@screens/AppNavigator/Screens/profile/share-address-component";

export const AddressBookScreen: React.FC = () => {
    const { addressBook } = useAddress()
    const [deleteModalVisible, setDeleteModalVisible] = useState<Boolean>(false)
    const [addressId, setAddressId] = useState<string | undefined>(undefined)
    const {setLoadingState} = useLoading()
    const toast = useToast()
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: "Address Book",
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl font-bold text-slate-900'),
            headerLeft: () => <ModalCloseIcon size={18} onPress={() => navigation.goBack()} />,
        })
    }, [])
    const deleteAddress = async () => {
        if (addressId === undefined) {
            return
        }
        try {
            setLoadingState(true)
            await _api.requestData({
                method: "DELETE",
                url: `/address-books/${addressId}`
            })
            showTost(toast, 'address deleted', 'success')
        } catch (error) {
            showTost(toast, 'failed to delete address', 'error')
        } finally {
            setLoadingState(false)
            setDeleteModalVisible(false)
        }
    }
    return (
        <View style={tailwind('flex flex-1 bg-white px-4')}>
            <ScrollView contentContainerStyle={tailwind('flex-grow')}>
                {addressBook.length > 0 ? (
                    <View style={tailwind('flex flex-col')}>
                        {addressBook.map((address, index) => {
                            return (
                                <View
                                    key={index}
                                    style={tailwind('py-3 border-b-0.5 border-slate-200 my-2 justify-between flex flex-row items-center rounded-lg')}
                                >
                                    <View style={tailwind('flex flex-col')}>
                                        <View style={tailwind('flex flex-row items-center')}>
                                            <Building style={tailwind('text-primary-100 mr-3')} size={20} />
                                            <View style={tailwind('flex flex-col')}>
                                                <Text style={tailwind('text-lg font-semibold text-slate-900 capitalize')}>{address.labelName}</Text>
                                                <Text style={tailwind('text-sm font-normal text-slate-900')}>{address.address.substring(0, 40)}</Text>
                                            </View>
                                        </View>
                                        <View style={tailwind('flex flex-row my-3 items-center')}>
                                           <MultiShare text={`Here is my address on Nana ${address.address}. Use the Pin: ${address.pin} for more accurate delivery`} >
                                                   <Text style={tailwind('underline text-slate-500')}>Share address</Text>
                                           </MultiShare>
                                            <View style={tailwind('flex ml-5 flex-row items-center')}>
                                                <Text style={tailwind('text-slate-500')}>PIN: {address.pin} </Text>
                                            </View>
                                        </View>
                                    </View>
                                    <Pressable style={tailwind('p-1')} onPress={() =>{
                                        setDeleteModalVisible(true)
                                        setAddressId(address._id)
                                    } }>
                                        <Trash style={tailwind('text-red-600')} size={16}/>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View style={tailwind('flex flex-col mt-20 items-center w-full')}>
                        <Text style={tailwind('font-medium text-lg text-slate-900')}>No Address saved</Text>
                        <Text style={tailwind('font-normal text-base text-slate-500 mt-4')}>Add address to use for later</Text>
                    </View>
                )}
            </ScrollView>
            <GenericButton
                style={tailwind('mb-5')}
                onPress={() => {
                    navigation.navigate(ModalScreenName.MODAL_ADD_ADDRESS_SCREEN, {
                        callback: () => navigation.navigate(ProfileScreenName.ADDRESS_BOOK)
                    })
                }}
                label="Add new address"
                labelColor={tailwind('text-white')}
                backgroundColor={tailwind('bg-primary-100')}
            />

            <Modal
                animationType="slide"
                transparent={true as any}
                visible={deleteModalVisible as any}
                onRequestClose={() => {
                    setDeleteModalVisible((prev) => !prev)
                }}
            >
                <View style={tailwind('flex-1 justify-center items-center')}>
                    <View style={[tailwind('m-5 bg-slate-200 rounded-lg p-4 items-center'), {elevation: 2}]}>
                        <Text style={tailwind('text-center text-base font-normal text-slate-900 mb-4')}>Are you sure you sure you want to delete this address?</Text>
                        <View style={tailwind('flex flex-row items-center w-full')}>
                            <GenericButton
                                label="Delete"
                                labelColor={tailwind('text-white font-light text-sm py-1')}
                                backgroundColor={tailwind('px-5 py-1')}
                                onPress={() => deleteAddress()}/>
                            <GenericButton
                                label="Cancel"
                                style={tailwind('mx-3')}
                                labelColor={tailwind('text-white font-light text-sm py-1')}
                                backgroundColor={tailwind('px-5 py-1')}
                                onPress={() => setDeleteModalVisible((prev) => !prev)}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
