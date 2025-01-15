import {Image, Text, ImageSourcePropType, View, Pressable, Dimensions} from "react-native";
import {tailwind} from "@tailwind";
import {useNavigation} from "@react-navigation/native";
import React from 'react'
import FoodIcon from '@assets/app/flat-icon-food.png'
import GroceriesIcon from '@assets/app/flat-icon-groceries.png'
import CourierIcon from '@assets/app/flat-icon-box.png'
import DeliveryIcon from '@assets/app/delivery-icon.png' // Assuming you have this icon
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {useProfile} from "@contexts/profile.provider";

import { CustomerIO } from "customerio-reactnative";

interface TagItemI {
    name: string
    icon: ImageSourcePropType
    onPress: (name: string) => void
}

export const TagItem: React.FC<TagItemI> = (props) => {
    return (
        <Pressable
            onPress={() => props.onPress(props.name)}
            style={tailwind('items-center p-1 w-1/3')}
        >
            <View style={[
                tailwind('flex bg-primary-50 flex-col items-center justify-center p-1 rounded-lg w-full'),
                {
                    minHeight: 120
                }
            ]}>
                <Image
                    source={props.icon}
                    style={{height: 55, width: 55, marginBottom: 10}}
                    resizeMode="contain"
                />
                <Text style={tailwind('text-center text-xs text-slate-900 font-medium')}>
                    {props.name}
                </Text>
            </View>
        </Pressable>
    )
}

export function CategorySection() {
    const navigation = useNavigation<any>()
    const {profile} = useProfile()
    const onPress = (screen: string) => {
        CustomerIO.track("homepage_actions", {
            screen
        });
        void navigation.navigate(screen)
    }

    const categories = [
        {
            name: "Order Food",
            icon: FoodIcon,
            screen: AppScreenName.FOOD
        },
        {
            name: "Stores",
            icon: GroceriesIcon,
            screen: AppScreenName.MART
        },
        {
            name: "Send Package",
            icon: CourierIcon,
            screen: AppScreenName.Courier
        }
    ]

    return (
        <View style={tailwind('mt-5 mb-10 w-full bg-white')}>
            <Text style={tailwind('font-bold text-lg my-3 text-slate-900')}>Hi {profile?.firstName}, What would you like to do?</Text>
            <View style={tailwind('flex flex-row flex-wrap ')}>
                {categories.map((category, index) => (
                    <TagItem
                        key={index}
                        name={category.name}
                        icon={category.icon}
                        onPress={() => onPress(category.screen)}
                    />
                ))}
            </View>
        </View>
    )
}
