import {AllCategoryTags, CategoryTags, TagsWithImages} from "@constants/MappedTags";
import {Image, Text, ImageSourcePropType, View, Pressable, Dimensions} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {useNavigation} from "@react-navigation/native";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import React from 'react'
import FoodIcon from '@assets/app/food-icon.png'
import GroceriesIcon from '@assets/app/groceries-icon.png'
import CourierIcon from '@assets/app/courier-icon.png'
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
interface TagItemI {
    name: CategoryTags | AllCategoryTags
    icon: ImageSourcePropType

    onPress: (name: CategoryTags | AllCategoryTags) => void
}

export const TagItem: React.FC<TagItemI> = (props) => {
    return (
        <Pressable onPress={() => props.onPress(props.name)} style={tailwind(' mr-3 mb-3')}>
            <View style={[tailwind('flex flex-col items-center justify-center w-full px-3 py-3 rounded-5'), {backgroundColor: 'rgba(230, 230, 230, 0.4)'}]}>
                <Image source={props.icon}  style={{height: 55, width: 55}} />
            </View>
            <Text style={tailwind('text-center text-sm')}>{props.name}</Text>
        </Pressable>
    )
}

export const MoreCategories: React.FC<{onPress: () => void}> = (props) => {
    return (
        <Pressable onPress={props.onPress} style={tailwind(' mr-1 mb-2 w-20 h-20')}>
            <View style={[tailwind('flex flex-col items-center justify-center w-full px-3 py-3 rounded-5'), {backgroundColor: 'rgba(230, 230, 230, 0.4)'}]}>
               <IconComponent iconType="Feather" name="more-horizontal" size={30} />
            </View>
            <Text style={tailwind('text-center text-sm')}>See All</Text>
        </Pressable>
    )
}

export function CategorySection() {
    const navigation = useNavigation<any>()
    const {width} = Dimensions.get('window')
    const onPress = (screen: string) => {
        void navigation.navigate(screen)
    }


    return (
        <View style={tailwind('mt-5  bg-white')}>
            <View style={tailwind('flex flex-row items-center justify-between')}>
                <Pressable onPress={() => onPress(AppScreenName.FOOD)} style={[tailwind('flex flex-col p-3 bg-gray-100 rounded-xl'), {height: 120, width: (width - 60) / 3}]}>
                    <View style={tailwind('flex flex-col ')}>
                        <Text style={tailwind('font-bold text-brand-black-500 text-lg')}>Food</Text>
                        <Text style={[tailwind('text-gray-500'), {fontSize: 7}]}>450 restaurants</Text>
                        <Image
                            resizeMode="contain"
                            style={[tailwind('self-end mt-2'), {width: 60, height: 43, marginBottom: -12, marginRight: -12}]}
                            source={FoodIcon}
                            width={60}
                            height={43}
                        />
                    </View>
                </Pressable>
                <Pressable onPress={() => onPress(AppScreenName.MART)} style={[tailwind('flex flex-col p-3 bg-gray-100 rounded-xl'), {height: 120, width: (width - 60) / 3}]}>
                    <View>
                        <Text style={tailwind('font-bold text-brand-black-500 text-lg')}>Mart</Text>
                        <Text style={[tailwind('text-gray-500'), {fontSize: 7}]}>20 super markets</Text>
                        <Image
                            source={GroceriesIcon}
                            style={[tailwind('self-end mt-2'), {width: 50, height: 50, marginBottom: -12, marginRight: -12}]}
                            width={60}
                            height={60}
                            resizeMode="contain"
                        />
                    </View>
                </Pressable>
                <Pressable onPress={() => onPress(AppScreenName.Courier)} style={[tailwind('flex flex-col p-3 bg-gray-100 rounded-xl'), {height: 120, width: (width - 60) / 3}]}>
                    <View>
                        <Text style={tailwind('font-bold text-brand-black-500 text-lg')}>Courier</Text>
                        <Text style={[tailwind('text-gray-500'), {fontSize: 7}]}>30 min delivery</Text>
                        <Image
                            style={[tailwind('self-end mt-2'), {width: 75, height: 50, marginBottom: -12, marginRight: -12}]}
                            source={CourierIcon}
                            width={75}
                            height={50}
                            resizeMode="contain"
                        />
                    </View>
                </Pressable>
            </View>
        </View>
    )
}

export function HomeScreenCategories (props: {from: number, to: number}) {
    const navigation = useNavigation<any>()
    const onPress = (tag: CategoryTags) => {
        void navigation.navigate(HomeScreenName.SINGLE_CATEGORY, {category: tag})
    }
    return (
        <View style={tailwind('pt-6 py-4 px-4 bg-white')}>
            <View style={tailwind('flex flex-row flex-wrap')}>
                {TagsWithImages.slice(props.from, props.to).map((tag, index) => (
                    <TagItem name={tag.name} key={index + tag.name} icon={tag.icon} onPress={() => onPress(tag.name)} />
                ))}
            </View>
        </View>
    )
}
