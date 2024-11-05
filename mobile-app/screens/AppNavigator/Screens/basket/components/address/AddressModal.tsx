import React, { RefObject, useCallback} from "react";
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
import {AddressBookI, AddressLabelI} from "@nanahq/sticky";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import {IconComponent} from "@components/commons/IconComponent";
import {useAppSelector} from "@store/index";
import {CircleX} from "lucide-react-native";

// AddressIconMapper remains the same
export const AddressIconMapper: Record<string, any> = {
    'Home':  {
        name: 'home',
        type: 'MaterialIcons'
    },
    'School':  {
        name: 'school',
        type: 'MaterialIcons'
    },
    'Office': {
        name: 'office-building-outline',
        type: 'MaterialCommunityIcons'
    },
    'Other': {
        name: 'location-on',
        type: 'MaterialIcons'
    }
}

type AddressBookModalProps = {
    promptModalName: string
    modalRef: RefObject<BottomSheetModalMethods>
    onDismiss?: () => void
    addressBook: AddressBookI[]
    addressLabel: AddressLabelI[]
    onAddressSelect: (address: AddressBookI) => void
    onAddNewAddress: () => void
    selectedAddressId: string | undefined
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

export function AddressBookModal(props: AddressBookModalProps): JSX.Element {
    const {addressBook} = useAppSelector(state => state.addressBook)
    const { dismiss } = useBottomSheetModal();

    const getSnapPoints = (): string[] => {
        if (props.addressBook.length <= 1) {
            return ["40%"]
        }
        if (props.addressBook.length >= 2) {
            return ["50%"]
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

    return (
        <BottomSheetModal
            enableContentPanningGesture={true}
            enableHandlePanningGesture={true}
            enablePanDownToClose={true}
            handleHeight={20}
            enableDismissOnClose={true}
            handleComponent={() => <View style={tailwind('flex flex-row justify-center w-full')}>
                <View style={tailwind('h-1 w-28 bg-gray-400 rounded-full')} />
            </View>}
            onDismiss={props.onDismiss}
            index={0}
            footerComponent={({animatedFooterPosition}) => (
                <ModalFooter
                    animatedFooterPosition={animatedFooterPosition}
                    onAddNewAddress={() => {
                        props.onAddNewAddress()
                        closeModal()
                    }}
                />
            )}
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
                    <Text style={tailwind('text-lg font-semibold text-slate-900')}>Saved Addresses</Text>
                    <TouchableOpacity onPress={closeModal}>
                        <CircleX style={[tailwind('text-gray-400')]} size={32} />
                    </TouchableOpacity>
                </View>
                {addressBook.length > 0 ? (
                    <View style={tailwind('flex flex-col')}>
                        {addressBook.map((address, index) => {
                            const iconMeta: any = AddressIconMapper[address?.labelId?.name ?? 'Other']
                            return (
                                <TouchableOpacity
                                    onPress={() => {
                                        props.onAddressSelect(address)
                                        closeModal()
                                    }}
                                    key={index}
                                    style={tailwind('py-3 justify-between flex flex-row items-center border-b-1.5 border-brand-ash')}
                                >
                                    <View style={tailwind('flex flex-row items-center')}>
                                        <IconComponent
                                            iconType={iconMeta.type}
                                            name={iconMeta.name}
                                            style={tailwind('text-primary-100 mr-3')}
                                            size={28}
                                        />
                                        <View style={tailwind('flex flex-col')}>
                                            <Text style={tailwind('text-base font-semibold text-slate-900 capitalize')}>{address.labelName}</Text>
                                            <Text style={tailwind('text-base font-normal text-slate-900')}>{address.address}</Text>
                                        </View>
                                    </View>
                                    {props.selectedAddressId !== undefined && props.selectedAddressId === address._id && (
                                        <IconComponent
                                            iconType="AntDesign"
                                            name="check"
                                            size={22}
                                            style={tailwind('text-primary-100')}
                                        />
                                    )}
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
