import {View, Text, TextInput} from "react-native";
import {tailwind} from "@tailwind";
import { StackScreenProps} from "@react-navigation/stack";
import {OrderParamsList} from "@screens/AppNavigator/Screens/orders/OrderNavigator";
import {OrderScreenName} from "@screens/AppNavigator/Screens/orders/OrderScreenName";
import React, {useEffect, useState} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {GenericButton} from "@components/commons/buttons/GenericButton";
import FastImage from "react-native-fast-image";
import moment from "moment";
import {NumericFormat as NumberFormat} from "react-number-format";
import {RatingRow} from "@screens/AppNavigator/Screens/orders/components/RatingRow";
import {useToast} from "react-native-toast-notifications";
import {showTost} from "@components/commons/Toast";
import {_api} from "@api/_request";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {useAnalytics} from "@segment/analytics-react-native";
import {KeyboardAwareScrollView} from "react-native-keyboard-aware-scroll-view";
import {useLoading} from "@contexts/loading.provider";
import {mutate} from "swr";

type SingleOrderScreenProps = StackScreenProps<OrderParamsList, OrderScreenName.ADD_REVIEW>
export const AddReviewScreen: React.FC<SingleOrderScreenProps> = ({navigation, route}) => {
    const [rating, setRating] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [reviewBody, setReviewBody] = useState<string>("")
    const {setLoadingState} = useLoading()
    const analytics = useAnalytics()
    const toast = useToast()
    useEffect(() => {
        void analytics.screen(OrderScreenName.ADD_REVIEW, {
            order: route.params.order._id
        })
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Rate your order`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('font-bold  text-slate-900'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        })
    }, [])


    const handleAddReview = async () => {
        if (reviewBody === "" || rating === 0) {
            showTost(toast, 'Please Add a rating and comment to submit', 'warning')
            return
        }
        const payload = {
            reviewBody,
            listing: route.params.order.listing[0]._id,
            order: route.params.order._id,
            vendor: route.params.order.vendor._id,
            reviewStars: rating
        }
        try {
            setLoadingState(true)
            setLoading(true)
            await _api.requestData({
                method: "POST",
                url: 'review/create',
                data: payload
            })
            showTost(toast, 'Review submitted', 'success')
            setTimeout(() => navigation.goBack(), 1000)
            await AsyncStorage.setItem(route.params.order._id, 'true')
            void analytics.track('CLICK:ADD-REVIEW', {
                rating,
                order: route.params.order._id
            })
            void mutate('order/orders')
        } catch (error) {
            showTost(toast, 'Failed to add review', 'error')
        } finally {
            setLoadingState(false)
            setLoading(false)
        }
    }
    const orderDate = moment(route.params.order.updatedAt).format('dddd Do')
    return (
        <KeyboardAwareScrollView style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('px-4 flex-grow mt-10')}>
                <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                    <View style={tailwind('flex flex-row items-center')}>
                        <FastImage
                            source={{uri: route.params.order.listing[0].photo, priority: FastImage.priority.normal}}
                            style={[tailwind('rounded-full'), {width: 70, aspectRatio: 1}]}
                        />
                       <View style={tailwind('flex flex-col ml-3')}>
                           <Text style={tailwind('text-slate-600 font-normal text-sm')}>{orderDate}</Text>
                           <Text style={tailwind('font-normal text-base text-slate-900')}>{route.params.order.listing[0].name}....</Text>
                       </View>
                    </View>
                    <View>
                        <Text style={tailwind('text-slate-600 font-normal text-sm')}>Delivered</Text>
                        <NumberFormat
                            prefix='₦'
                            value={route.params.order.orderValuePayable}
                            thousandSeparator
                            displayType="text"
                            renderText={(value) => (
                                <Text
                                    style={tailwind('text-slate-900 font-normal text-base')}
                                >
                                    {value}
                                </Text>
                            )}
                        />
                    </View>
                </View>
                <View style={tailwind('mt-10')}>
                    <Text style={tailwind('font-medium text-base text-slate-900')}>How was the food?</Text>
                    <View style={tailwind('mt-4 flex flex-col')}>
                        <RatingRow onPress={setRating} currentRating={rating} />
                        <View style={tailwind('flex flex-col mt-10')}>
                            <Text style={tailwind('text-sm text-slate-900 font-normal')}>Leave a comment</Text>
                            <TextInput
                                defaultValue={reviewBody}
                                onChangeText={value => setReviewBody(value)}
                                textAlignVertical="top"
                                multiline
                                numberOfLines={4}
                                style={[tailwind('py-4 w-full px-3  bg-primary-200 rounded text-slate-900 text-sm font-normal'), {height: 150}]}
                                placeholder='Delicious food'
                            />
                        </View>
                    </View>
                </View>

            </View>
            <View style={tailwind('mt-10 px-4')}>
                <GenericButton loading={loading} onPress={handleAddReview} label="Submit Rating" labelColor={tailwind('text-white')} />
            </View>
        </KeyboardAwareScrollView>
    )
}
