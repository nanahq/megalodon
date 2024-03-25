import {DeliveryFeeResult, VendorUserI} from "@nanahq/sticky";
import React, { memo, useEffect, useState } from "react";
import { Pressable, StyleProp, Text, View, ViewStyle} from "react-native";
import { tailwind } from "@tailwind";
import { _api } from "@api/_request";
import { SkeletonLoader, SkeletonLoaderScreen } from "@components/commons/SkeletonLoaders/SkeletonLoader";
import {IconComponent} from "@components/commons/IconComponent";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import {useAppSelector} from "@store/index";
import FastImage from "react-native-fast-image";
import {useAnalytics} from "@segment/analytics-react-native";

const _VendorCard: React.FC<{ vendor: VendorUserI, fullWidth?: boolean, style?: StyleProp<ViewStyle>, height?: number}> = (props) => {
    const [travelInfo, setTravelInfo] = useState<DeliveryFeeResult | undefined>(undefined);
    const userProfile = useAppSelector(state => state.profile)
    const [loading, setLoading] = useState<boolean>(true);
    const navigator = useNavigation<NavigationProp<AppParamList>>()
    const [error, setError] = useState<boolean>(false)

    const analytics = useAnalytics()


    console.log(props.vendor)
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await _api.requestData({
                    method: "POST",
                    url: "location/delivery-fee",
                    data: {
                        userCoords: userProfile.profile.location?.coordinates,
                        vendorCoords: props.vendor.location.coordinates ,
                    },
                });
                setTravelInfo(() => data as any);
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


    const onPress = () => {
        void analytics.track('CLICK:VENDOR-CARD-HOMEPAGE', {
            vendor: props.vendor._id
        })
        navigator.navigate(ModalScreenName.MODAL_VENDOR_SCREEN, {
            vendor: props.vendor,
            delivery: travelInfo
        })

    }
    return (
        <Pressable onPress={onPress} style={[tailwind("w-full mb-1 flex flex-col "), props.style, { width: props.fullWidth ? undefined : 300, height: props.height ? undefined : 250 }]}>
            <View style={tailwind("flex flex-col w-full items-center")}>
                <FastImage
                    source={{ uri: props.vendor.businessImage, priority: FastImage.priority.high }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={[tailwind("w-full rounded-lg"), { aspectRatio: 2 }]}
                />
            </View>
            <View style={tailwind("p-2")}>
                <Text style={tailwind("text-lg text-black")}>{props.vendor.businessName}</Text>
                {loading && (
                    <View>
                        <SkeletonLoader row={1} screen={SkeletonLoaderScreen.VendorDistanceLoader} />
                    </View>
                )}
                <View style={tailwind('flex mt-2 flex-row w-full justify-between items-center')}>
                    {!loading && !error && (
                        <View style={tailwind("flex flex-row items-center ")}>
                            <View style={tailwind("flex flex-row items-center border-r-0.5 pr-1 border-gray-300")}>
                                <IconComponent iconType="MaterialIcons" name="delivery-dining" size={16} style={tailwind('font-medium text-black mr-1')} />
                                <Text style={tailwind("text-sm text-black")}>from ₦{travelInfo?.fee}</Text>
                            </View>
                            <Text style={tailwind("text-black mx-1 text-sm")}>{10}-{Number(travelInfo?.duration ?? 0) + Number(props?.vendor?.settings?.preparationTime ?? 0)} Min</Text>
                        </View>
                    )}
                    <View style={tailwind("flex flex-row items-center")}>
                        <IconComponent iconType="AntDesign" name="star" style={tailwind("w-4 h-4 text-yellow-300")} />
                        <Text style={tailwind("text-sm font-bold text-gray-900")}>4.95</Text>
                        <Text
                            style={tailwind("text-sm font-medium text-gray-900 ml-1")}>(1000)</Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
};

export const VendorCard = memo(_VendorCard);
