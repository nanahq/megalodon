import React, {RefObject, useCallback, useState} from "react";
import {tailwind} from "@tailwind";
import {View, Text, TouchableOpacity, ScrollView, Pressable} from "react-native";
import * as Device from 'expo-device'
import {
    BottomSheetBackdropProps,
    BottomSheetBackgroundProps,
    BottomSheetFooter,
    BottomSheetFooterProps,
    BottomSheetModal,
    useBottomSheetModal,
} from "@gorhom/bottom-sheet";
import {BottomSheetModalMethods} from "@gorhom/bottom-sheet/lib/typescript/types";
import {AddressBookI, AddressLabelI, PinAddressI} from "@nanahq/sticky";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {BriefcaseBusiness, Building, CircleX, GraduationCap, Home} from "lucide-react-native";
import {useAddress} from "@contexts/address-book.provider";
import {PlacesInput} from "@screens/AppNavigator/Screens/home/components/auto-complete-input";
import {TextInputWithLabel} from "@components/commons/inputs/TextInputWithLabel";
import {useLoading} from "@contexts/loading.provider";
import {_api} from "@api/_request";


type AddressBookModalProps = {
    title: string
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    onDismiss?: () => void
    addressBook: AddressBookI[]
    addressLabel: AddressLabelI[]
    onAddressSelect: (address: AddressBookI) => void

}

const CustomBackdrop = ({ animatedIndex, style, ...props }: BottomSheetBackdropProps) => {
    const { dismiss } = useBottomSheetModal();
    return (
        <Pressable
            onPress={() => dismiss()}
            style={[
                style,
                tailwind("absolute inset-0 bg-black bg-opacity-60")
            ]}
            {...props}
        />
    );
};

export function BoxAddressModal(props: AddressBookModalProps): JSX.Element {
    const { dismiss } = useBottomSheetModal();
    const [addressPin, setAddressPin] = useState("");
    const {setLoadingState} = useLoading()
    const getSnapPoints = (): string[] => {
        if (props.addressBook.length <= 1) {
            return ["60%"]
        }
        if (props.addressBook.length >= 2) {
            return ["70%"]
        } else if (props.addressBook.length < 6) {
            const size = props.addressBook.length * 20
            return [`${size > 90 ? 90 : size}%`]
        }
        return ["50%"]
    }

    const closeModal = useCallback(() => {
        dismiss(props.promptModalName);
        props.onDismiss?.();
    }, [props.promptModalName, props.onDismiss]);


    const Icon = (labelType: string) => {
        switch (labelType) {
            case "Home":
                return <Home style={tailwind('w-3 h-3 mr-1.5 text-primary-100')} />

            case "Office":
                return <BriefcaseBusiness style={tailwind('w-3 mr-1.5 h-3 text-primary-100')} />

            case "School":
                return <GraduationCap style={tailwind('w-3 h-3 mr-1.5 text-primary-100')} />

            case "Other":
                return <Building style={tailwind('w-3 h-3 mr-1.5 text-primary-100')} />
        }
    }

    const handleGetAddressByPin = async (text: string) => {
        closeModal()
        try {
            setLoadingState(true)
            const {data} = await _api.requestData<any, AddressBookI | null >({
                method: 'GET',
                url: `address-books/address/${text}`
            })

            if(data !== null && Boolean(data)) {
                props.onAddressSelect(data)
            }
        } catch (error) {
            props.modalRef.current?.present()
        } finally {
            setLoadingState(false)
        }
    }
    return (
        <BottomSheetModal
            enableContentPanningGesture={true}
            enableHandlePanningGesture={true}
            enablePanDownToClose={true}
            handleHeight={20}
            enableDismissOnClose={true}
            handleComponent={() => <View style={tailwind('flex flex-row justify-center w-full')}>
                <View style={tailwind('h-1 w-28 bg-slate-900 rounded-full')} />
            </View>}
            onDismiss={props.onDismiss}
            index={0}
            onChange={(index) => {
                if (index === -1) {
                    closeModal()
                }
            }}
            name={props.promptModalName}
            ref={props.modalRef}
            snapPoints={getSnapPoints()}
            backdropComponent={CustomBackdrop}
            backgroundComponent={(backgroundProps: BottomSheetBackgroundProps) => (
                <View
                    {...backgroundProps}
                    style={tailwind('bg-primary-50 rounded-t-xl')}
                />
            )}
        >
            <ScrollView style={tailwind('bg-white rounded-t-3xl px-5 pt-10 flex-1')}>
                <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                    <Text style={tailwind('font-bold text-lg text-slate-900')}>{props.title}</Text>
                </View>
                <View style={tailwind(' mt-3 mb-5 pb-2')}>
                    <Text
                        style={[tailwind('font-normal text-xs text-slate-500')]}>
                        Enter the address or PIN shared to you
                    </Text>
                    <PlacesInput
                        onAddressChange={(text) => {
                            if( text.length === 5 && /^\d{5}$/.test(text)) {
                                void handleGetAddressByPin(text)
                            }
                        }}
                        placeholder="Type Address or enter address pin"
                        onLocationSelect={(location) => {
                            const formattedAddress: AddressBookI = {
                                address: location.address,
                                location: {
                                    type: "Point",
                                    coordinates: [location.latitude, location.longitude]
                                },
                                labelName: location.address,
                                _id: location.locality,
                            } as any
                           props.onAddressSelect(formattedAddress)
                            closeModal()
                        }}
                    />
                </View>
                {props.addressBook.length > 0 ? (
                    <View style={tailwind('flex flex-col')}>
                        <Text
                            style={[tailwind('font-normal text-xs text-slate-500')]}>
                            Select from saved addresses in your address book.
                        </Text>
                        {props.addressBook.map((address, index) => {
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        props.onAddressSelect(address)
                                        closeModal()
                                    }}
                                    key={index}
                                    style={tailwind('py-3 justify-between flex flex-row items-center border-b-1.5 border-slate-200')}
                                >
                                    <View style={tailwind('flex flex-row items-center')}>
                                        {Icon(address?.labelId?.name ?? 'Other')}
                                        <View style={tailwind('flex flex-col')}>
                                            <Text style={tailwind('text-sm font-normal text-slate-900 capitalize')}>{address.labelName}</Text>
                                            <Text style={tailwind('text-sm font-light text-slate-500')}>{address.address}</Text>
                                        </View>
                                    </View>
                                </TouchableOpacity>
                            )
                        })}
                    </View>
                ): (
                    <View style={tailwind('flex flex-row mt-20 justify-center w-full')}>
                        <Text style={tailwind('font-semibold text-lg text-slate-600')}>No Address added</Text>
                    </View>
                )}
            </ScrollView>
        </BottomSheetModal>
    );
}

interface ModalFooterProps extends BottomSheetFooterProps {
    onAddNewAddress: () => void
}

const ModalFooter: React.FC<ModalFooterProps> = ({animatedFooterPosition, onAddNewAddress}) => {
    const { bottom: bottomSafeArea } = useSafeAreaInsets();
    const isAndroid = Device.osName === 'Android'
    return (
        <BottomSheetFooter
            style={tailwind('px-5 flex flex-row w-full')}
            animatedFooterPosition={animatedFooterPosition}
            bottomInset={bottomSafeArea}
        >
            <GenericButton
                style={tailwind('w-full', {'mb-3': isAndroid})}
                onPress={() => onAddNewAddress() }
                label="Add new address"
                backgroundColor={tailwind('bg-primary-100')}
                labelColor={tailwind('text-white')}
            />
        </BottomSheetFooter>
    )
}

function EmptyHandleComponent(): JSX.Element {
    return <View />;
}
