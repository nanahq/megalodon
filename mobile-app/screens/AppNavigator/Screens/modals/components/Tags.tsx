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
        <View style={tailwind('mt-5  w-full bg-white')}>
            <View style={tailwind('flex flex-col w-full')}>
                <Text style={tailwind('mb-3')}>What would you like today?</Text>
               <View style={tailwind('flex flex-row w-full justify-between items-center')}>
                   <Pressable onPress={() => onPress(AppScreenName.FOOD)} style={[tailwind('flex flex-col p-3 bg-gray-50 rounded-xl'), {height: 100, width: (width - 50) / 2}]}>
                       <View style={tailwind('flex flex-row items-center justify-between')}>
                           <View>
                               <Text style={tailwind('text-brand-black-500 text-lg')}>Order food</Text>
                               <Text style={[tailwind('text-gray-500'), {fontSize: 10}]}>450 restaurants</Text>
                           </View>
                           <Image
                               resizeMode="contain"
                               style={[tailwind('self-end mt-2'), {width: 80, height: 80}]}
                               source={FoodIcon}
                               width={60}
                               height={43}
                           />
                       </View>
                   </Pressable>
                   <Pressable onPress={() => onPress(AppScreenName.MART)} style={[tailwind('flex flex-col p-3 bg-gray-100 rounded-xl'), {height: 100, width: (width - 50) / 2}]}>
                       <View style={tailwind('flex flex-row items-center justify-between')}>
                          <View>
                              <Text style={tailwind('text-brand-black-500 text-lg')}>Supermarket</Text>
                              <Text style={[tailwind('text-gray-500'), {fontSize: 10}]}>20 super markets</Text>
                          </View>
                           <Image
                               source={GroceriesIcon}
                               style={[tailwind('self-end mt-2'), {width: 70, height: 70}]}
                               width={60}
                               height={60}
                               resizeMode="contain"
                           />
                       </View>
                   </Pressable>
               </View>
                <Pressable onPress={() => onPress(AppScreenName.Courier)} style={[tailwind('flex bg-gray-100 flex-col w-full p-3  rounded-xl mt-3'), {height: 100, width: width - (width /3)}]}>
                    <View style={tailwind('flex flex-row items-center justify-between')}>
                        <View>
                            <Text style={tailwind('text-brand-black-500 text-lg')}>Send/receive package</Text>
                            <Text style={[tailwind('text-gray-500'), {fontSize: 10}]}>30 min delivery</Text>
                        </View>
                        <Image
                            style={[tailwind('self-end mt-2'), {width: 80, height: 80}]}
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
