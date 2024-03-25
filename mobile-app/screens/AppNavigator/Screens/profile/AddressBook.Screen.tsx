import {Pressable, ScrollView, Text, View, Modal} from "react-native";
import { IconComponent } from "@components/commons/IconComponent";
import React, {useEffect, useState} from "react";
import { AddressIconMapper } from "@screens/AppNavigator/Screens/basket/components/address/AddressModal";
import {useAppDispatch, useAppSelector} from "@store/index";
import { tailwind } from "@tailwind";
import { LoaderComponentScreen } from "@components/commons/LoaderComponent";
import { GenericButton } from "@components/commons/buttons/GenericButton";
import {AddressBookState, fetchAddressBook} from "@store/AddressBook.reducer";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {ProfileScreenName} from "@screens/AppNavigator/Screens/profile/ProfileScreenName";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {ModalBackIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";

export const AddressBookScreen: React.FC = () => {
    const { addressBook, hasFetchedAddresses } = useAppSelector<AddressBookState>(state => state.addressBook);
    const [deleteModalVisible, setDeleteModalVisible] = useState<Boolean>(false)
    const [addressId, setAddressId] = useState<string | undefined>(undefined)
    const [loading, setLoading] = useState<boolean>(false)

    const toast = useToast()
    const dispatch = useAppDispatch()
    const navigation = useNavigation<NavigationProp<AppParamList>>()

    useEffect(() => {
        navigation.setOptions({
            headerLeft: () => <ModalBackIcon onPress={() => navigation.goBack()} />,
        })
    }, [])
    const deleteAddress = async () => {
        if (addressId === undefined) {
            return
        }
        try {
            setLoading(true)
            await _api.requestData({
                method: "DELETE",
                url: `/address-books/${addressId}`
            })
            showTost(toast, 'address deleted', 'success')
            dispatch(fetchAddressBook())
        } catch (error) {
            showTost(toast, 'failed to delete address', 'error')
        } finally {
            setLoading(false)
            setDeleteModalVisible(false)
        }
    }
    if (!hasFetchedAddresses) {
        return <LoaderComponentScreen />;
    }
    return (
        <View style={tailwind('flex flex-1 bg-white px-4')}>
            <ScrollView contentContainerStyle={tailwind('flex-grow')}>
                {addressBook.length > 0 ? (
                    <View style={tailwind('flex flex-col')}>
                        {addressBook.map((address, index) => {
                            const iconMeta: any = AddressIconMapper[address?.labelId?.name ?? 'Other'];
                            return (
                                <View
                                    key={index}
                                    style={tailwind('py-3 justify-between flex flex-row items-center border-b-1.5 border-brand-ash')}
                                >
                                    <View style={tailwind('flex flex-row items-center')}>
                                        <IconComponent iconType={iconMeta.type} name={iconMeta.name} style={tailwind('text-primary-500 mr-3')} size={30} />
                                        <View style={tailwind('flex flex-col')}>
                                            <Text style={tailwind('text-lg capitalize')}>{address.labelName}</Text>
                                            <Text style={tailwind('text-sm text-brand-gray-700')}>{address.address}</Text>
                                        </View>
                                    </View>
                                    <Pressable style={tailwind('p-1')} onPress={() =>{
                                        setDeleteModalVisible(true)
                                        setAddressId(address._id)
                                    } }>
                                        <IconComponent iconType="AntDesign" name="delete" style={tailwind('text-error-600')} size={16}/>
                                    </Pressable>
                                </View>
                            );
                        })}
                    </View>
                ) : (
                    <View style={tailwind('flex flex-col mt-20 items-center w-full')}>
                        <Text style={tailwind('font-medium text-2xl text-brand-gray-700')}>No Address saved</Text>
                        <Text style={tailwind('font-medium text-xl text-brand-gray-700')}>Add address to use for later</Text>
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
                label="Add address"
                labelColor={tailwind('text-white')}
                backgroundColor={tailwind('bg-primary-500')}
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
                    <View style={[tailwind('m-5 bg-gray-100 rounded-lg p-4 items-center'), {elevation: 0.5}]}>
                        <Text style={tailwind('text-center text-lg mb-4')}>Are you sure you sure you want to delete this address?</Text>
                        <View style={[tailwind(''), {width: 350}]}>
                            <GenericButton
                                loading={loading}
                                style={tailwind('mb-3')}
                                label="Delete"
                                labelColor={tailwind('text-white font-medium py-1')}
                                backgroundColor={tailwind('bg-red-700')}
                                onPress={() => deleteAddress()}/>

                            <GenericButton
                                style={tailwind('border-0.5 border-black')}
                                label="Cancel"
                                labelColor={tailwind('text-black font-medium py-1')}
                                backgroundColor={tailwind('bg-transparent')}
                                onPress={() => setDeleteModalVisible((prev) => !prev)}/>
                        </View>
                    </View>
                </View>
            </Modal>
        </View>
    );
};
