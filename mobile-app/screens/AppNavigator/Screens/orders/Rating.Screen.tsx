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

type SingleOrderScreenProps = StackScreenProps<OrderParamsList, OrderScreenName.ADD_REVIEW>
export const AddReviewScreen: React.FC<SingleOrderScreenProps> = ({navigation, route}) => {
    const [rating, setRating] = useState<number>(0)
    const [loading, setLoading] = useState<boolean>(false)
    const [reviewBody, setReviewBody] = useState<string>("")
    const toast = useToast()
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: `Rate your order`,
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl'),
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        })
    }, [])


    const handleAddReview = async () => {
        if (reviewBody === "" || rating === 0) {
            showTost(toast, 'Please Add a rating and comment to submit', 'error')
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
            setLoading(true)
            await _api.requestData({
                method: "POST",
                url: 'review/create',
                data: payload
            })
            showTost(toast, 'Review submitted', 'success')
            setTimeout(() => navigation.goBack(), 1000)
            await AsyncStorage.setItem(route.params.order._id, 'true')
        } catch (error) {
            showTost(toast, 'Failed to add review', 'error')
        } finally {
            setLoading(false)
        }
    }
    const orderDate = moment(route.params.order.updatedAt).format('dddd Do')
    return (
        <View style={tailwind('flex-1 bg-white')}>
            <View style={tailwind('px-4 flex-grow mt-10')}>
                <View style={tailwind('flex flex-row items-center w-full justify-between')}>
                    <View style={tailwind('flex flex-row items-center')}>
                        <FastImage
                            source={{uri: route.params.order.listing[0].photo, priority: FastImage.priority.normal}}
                            style={[tailwind('rounded-full'), {width: 70, aspectRatio: 1}]}
                        />
                       <View style={tailwind('flex flex-col ml-3')}>
                           <Text style={tailwind('text-lg text-brand-gray-700')}>{orderDate}</Text>
                           <Text style={tailwind('text-lg')}>{route.params.order.listing[0].name}....</Text>
                       </View>
                    </View>
                    <View>
                        <Text style={tailwind('text-brand-gray-700 text-lg')}>Delivered</Text>
                        <NumberFormat
                            prefix='₦'
                            value={route.params.order.orderValuePayable}
                            thousandSeparator
                            displayType="text"
                            renderText={(value) => (
                                <Text
                                    style={tailwind('text-lg')}
                                >
                                    {value}
                                </Text>
                            )}
                        />
                    </View>
                </View>
                <View style={tailwind('mt-10')}>
                    <Text style={tailwind('font-bold text-2xl')}>How was the food?</Text>
                    <View style={tailwind('mt-4 flex flex-col')}>
                        <RatingRow onPress={setRating} currentRating={rating} />
                        <View style={tailwind('flex flex-col mt-10')}>
                            <Text style={tailwind('text-lg')}>Leave a comment</Text>
                            <TextInput
                                defaultValue={reviewBody}
                                onChangeText={value => setReviewBody(value)}
                                textAlignVertical="top"
                                multiline
                                numberOfLines={4}
                                style={[tailwind('py-4 w-full px-3  bg-primary-200 rounded  text-lg text-black'), {height: 150}]}
                                placeholderTextColor='This food is very good!'
                            />
                        </View>
                    </View>
                </View>

            </View>
            <View style={tailwind('mb-5 px-4')}>
                <GenericButton loading={loading} onPress={handleAddReview} label="Submit Rating" labelColor={tailwind('text-white')} backgroundColor={tailwind('bg-primary-500')} />
            </View>
        </View>
    )
}
