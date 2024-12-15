import {DeliveryFeeResult, VendorUserI} from "@nanahq/sticky";
import React, { memo, useEffect, useState } from "react";
import {Dimensions, Pressable, StyleProp, Text, View, ViewStyle} from "react-native";
import { tailwind } from "@tailwind";
import { _api } from "@api/_request";
import { SkeletonLoader, SkeletonLoaderScreen } from "@components/commons/SkeletonLoaders/SkeletonLoader";
import {IconComponent} from "@components/commons/IconComponent";
import {NavigationProp, useNavigation} from "@react-navigation/native";
import {ModalScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {AppParamList} from "@screens/AppNavigator/AppNav";
import FastImage from "react-native-fast-image";
import {useAnalytics} from "@segment/analytics-react-native";
import {useProfile} from "@contexts/profile.provider";
import {Clock} from "lucide-react-native";

const _VendorCard: React.FC<{ vendor: VendorUserI, fullWidth?: boolean, style?: StyleProp<ViewStyle>, height?: number}> = (props) => {
    const [travelInfo, setTravelInfo] = useState<DeliveryFeeResult | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const {profile} = useProfile()
    const navigator = useNavigation<NavigationProp<AppParamList>>()
    const [error, setError] = useState<boolean>(false)
    const {width: screenWidth} = Dimensions.get('window')
    const analytics = useAnalytics()
    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await _api.requestData({
                    method: "POST",
                    url: "location/delivery-fee",
                    data: {
                        userCoords: profile.location?.coordinates,
                        vendorCoords: props?.vendor?.location?.coordinates ,
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
        } as any)

    }
    return (
        <Pressable
            onPress={onPress} style={[tailwind("w-full mb-1 flex flex-1 flex-col "), props.style, { maxWidth: "100%", minHeight:200,  width: screenWidth / 2 }]}>
                <FastImage
                    source={{ uri: props.vendor.businessImage, priority: FastImage.priority.high }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={[tailwind("w-full rounded-lg "), { aspectRatio: 4/2 }]}
                />
            <View style={tailwind("px-1.5")}>
                <Text style={tailwind("font-semibold mt-1 uppercase text-base text-slate-900")}>{`${props.vendor.businessName}`}</Text>
                {loading && (
                    <View>
                        <SkeletonLoader row={1} screen={SkeletonLoaderScreen.VendorDistanceLoader} />
                    </View>
                )}
                <View style={tailwind('flex mt-1 flex-row w-full justify-between items-center')}>
                    {!loading && !error && (
                        <View style={tailwind("flex flex-col ")}>
                                <Text style={tailwind("font-light text-sm text-slate-500 mb-1")}>&#8358; {travelInfo?.fee} Delivery fee</Text>
                                <Text style={tailwind("text-slate-500 font-light text-sm")}>At your doorsteps in {Number(travelInfo?.duration ?? 0) + Number(props?.vendor?.settings?.preparationTime ?? 0)} Minutes</Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
};

const _VendorCardFullWidth:  React.FC<{ vendor: VendorUserI, fullWidth?: boolean, style?: StyleProp<ViewStyle>, height?: number}> = (props) => {
    const [travelInfo, setTravelInfo] = useState<DeliveryFeeResult | undefined>(undefined);
    const [loading, setLoading] = useState<boolean>(true);
    const navigator = useNavigation<NavigationProp<AppParamList>>()
    const [error, setError] = useState<boolean>(false)
    const {profile} = useProfile()
    const analytics = useAnalytics()

    useEffect(() => {
        async function fetchData() {
            try {
                const { data } = await _api.requestData({
                    method: "POST",
                    url: "location/delivery-fee",
                    data: {
                        userCoords: profile.location?.coordinates,
                        vendorCoords: props?.vendor?.location?.coordinates ,
                    },
                });
                setTravelInfo(() => data as any);
            } catch (error) {
                console.log(error)
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
        <Pressable
            onPress={onPress} style={[tailwind("w-full flex flex-col  "), props.style,]}>
            <View style={tailwind("flex flex-col w-full items-center")}>
                <FastImage
                    source={{ uri: props.vendor.businessImage, priority: FastImage.priority.high }}
                    resizeMode={FastImage.resizeMode.cover}
                    style={[tailwind("w-full rounded-lg"), { aspectRatio: 2.5 }]}
                />
            </View>
            <View style={tailwind("p-1 mt-2")}>
                <Text style={tailwind("font-semibold uppercase text-base text-slate-900")}>{`${props.vendor.businessName}`}</Text>
                {loading && (
                    <View>
                        <SkeletonLoader row={1} screen={SkeletonLoaderScreen.VendorDistanceLoader} />
                    </View>
                )}
                <View style={tailwind('flex mt-1 flex-row w-full justify-between items-center')}>
                    {!loading && !error && (
                        <View style={tailwind("flex flex-col ")}>
                            <Text style={tailwind("font-light text-sm text-slate-500 mb-1")}>&#8358;{travelInfo?.fee} delivery fee</Text>
                            <Text style={tailwind("text-slate-500 font-light text-sm")}>At your doorsteps in {Number(travelInfo?.duration ?? 0) + Number(props?.vendor?.settings?.preparationTime ?? 0)} Minutes</Text>
                        </View>
                    )}
                </View>
            </View>
        </Pressable>
    );
}
export const VendorCard = memo(_VendorCard);
export const VendorCardFullWidth = memo(_VendorCardFullWidth);
