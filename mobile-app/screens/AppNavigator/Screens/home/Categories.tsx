import {View} from "react-native";
import {tailwind} from "@tailwind";
import React, {useEffect} from "react";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {StackScreenProps} from "@react-navigation/stack";
import {HomeParamsList} from "@screens/AppNavigator/Screens/home/HomeNavigator";
import {AllCategoryTags, AllTagsWithImages} from "@constants/MappedTags";
import {TagItem} from "@screens/AppNavigator/Screens/modals/components/Tags";

type HomepageCategoryProps = StackScreenProps<HomeParamsList, HomeScreenName.CATEGORIES_SCREEN>
export const HomepageCategory: React.FC<HomepageCategoryProps> = ({navigation}) => {
    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: 'All categories',
            headerBackTitleVisible: false,
            headerTitleAlign: 'center',
            headerTitleStyle: tailwind('text-xl  text-slate-900 font-bold'),
            headerStyle:  {
                shadowOpacity: 8,
                shadowRadius: 12,
            },
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        })
    }, [])

    const onPress = (tag: AllCategoryTags) => {
        void navigation.navigate(HomeScreenName.SINGLE_CATEGORY, {category: tag})
    }

    return (
        <View style={tailwind('flex flex-1 bg-white px-5')}>
            <View style={tailwind('flex flex-row items-center mt-10 flex-wrap')}>
                {AllTagsWithImages.map(tag => (
                    <TagItem key={tag.name} name={tag.name} icon={tag.icon} onPress={() => onPress(tag.name)} />
                ))}
            </View>
        </View>
    )
}
