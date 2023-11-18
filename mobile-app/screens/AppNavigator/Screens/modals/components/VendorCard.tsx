import {DeliveryFeeResult, VendorUserI} from "@nanahq/sticky";
import React, { memo, useEffect, useState } from "react";
import { Image, Pressable, Text, View } from "react-native";
import { tailwind } from "@tailwind";
import { _api } from "@api/_request";
import { SkeletonLoader, SkeletonLoaderScreen } from "@components/commons/SkeletonLoaders/SkeletonLoader";
import {IconComponent} from "@components/commons/IconComponent";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {useAppSelector} from "@store/index";
import * as Device from 'expo-device'

const _VendorCard: React.FC<{ vendor: VendorUserI }> = (props) => {
    const [travelInfo, setTravelInfo] = useState<DeliveryFeeResult | undefined>(undefined);
    const userProfile = useAppSelector(state => state.profile)
    const [loading, setLoading] = useState<boolean>(true);
    const navigator = useNavigation<NavigationProp<AppParamList>>()
    const [error, setError] = useState<boolean>(false)

    const isAndroid = Device.osName === 'Android'
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await _api.requestData({
                    method: "POST",
                    url: "location/delivery-fee",
                    data: {
                        userCoords: userProfile.profile.location?.coordinates ,
                        vendorCoords: props.vendor.location.coordinates ,
                    },
                });
                setTravelInfo(() => data);
            } catch (error) {
                setError(() => true)
            } finally {
                setLoading(() => false);
            }
        }

        if (loading) {
            void fetchData();
        }
    }, [loading, props.vendor.location.coordinates]);


    const onPress = () => navigator.navigate(ModalScreenName.MODAL_VENDOR_SCREEN, {
        vendor: props.vendor
    })

    return (
        <Pressable onPress={onPress} style={[tailwind("w-full mb-4 flex flex-col mr-5"), { width: 300, height: 215 }]}>
            <View style={tailwind("flex flex-col w-full")}>
                <Image source={{ uri: props.vendor.businessImage, cache: "force-cache" }} style={[tailwind("w-full rounded-lg"), { height: isAndroid ? 150 : 155 }]} />
            </View>
            <View style={tailwind("p-2")}>
                <Text style={tailwind("flex font-bold text-lg text-black")}>{props.vendor.businessName}</Text>
                {loading && (
                    <View>
                        <SkeletonLoader row={1} screen={SkeletonLoaderScreen.VendorDistanceLoader} />
                    </View>
                )}
                {!loading && !error && (
                    <View style={tailwind("flex flex-row items-center")}>
                        <View style={tailwind("flex flex-row items-center")}>
                            <Text style={tailwind("text-brand-gray-text-500")}>₦{travelInfo?.fee} Delivery Fee</Text>
                            <IconComponent iconType="MaterialIcons" name="delivery-dining" size={14} style={tailwind('font-medium text-black ml-1')} />
                        </View>
                        <Text style={tailwind("text-brand-gray-text-500 mx-1")}>{10}-{Number(travelInfo?.duration ?? 0) + Number(props?.vendor?.settings?.preparationTime ?? 0)} Minutes</Text>
                    </View>
                )}
            </View>
        </Pressable>
    );
};

export const VendorCard = memo(_VendorCard);
