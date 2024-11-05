import {Pressable, ScrollView} from "react-native";
import {tailwind} from "@tailwind";
import {StackScreenProps} from "@react-navigation/stack";
import {HomeParamsList} from "@screens/AppNavigator/Screens/home/HomeNavigator";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import React, {useEffect} from "react";
import {ArrowLeft} from 'lucide-react-native'
import {VendorCardFullWidth} from "@screens/AppNavigator/Screens/modals/components/VendorCard";
import {FlashList} from "@shopify/flash-list";
import {HomeSectionVertical} from "@screens/AppNavigator/Screens/home/components/HomeSection";

type ScreenProps = StackScreenProps<HomeParamsList, HomeScreenName.CATEGORIES_SCREEN>

export const HomepageSectionScreen: React.FC<ScreenProps> = ({route, navigation}) => {

    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerTitle: route.params.heading,
            headerLeftContainerStyle: tailwind('px-5'),
            headerTitleStyle: tailwind('font-bold text-2xl text-slate-900'),
            headerTitleAlign: 'center',
            headerLeft: () => <Pressable onPress={() => navigation.goBack()}>
                <ArrowLeft style={tailwind('text-slate-900')} size={26} />
            </Pressable>
        })
    }, [])

    function RenderItem ({item}: any) {
        return <VendorCardFullWidth  style={tailwind('mb-5')} vendor={item}/>
    }
    return (
        <ScrollView style={tailwind('flex-1 bg-white px-5')}>
            <HomeSectionVertical label={route.params.heading}>
                <FlashList
                    showsVerticalScrollIndicator={false}
                    data={route.params.items.sort((a, b) => a.ratings.totalReviews - b.ratings.totalReviews) as any}
                    renderItem={(props) => <RenderItem {...props} />}
                    keyExtractor={item => item._id}
                    estimatedItemSize={100}
                />
            </HomeSectionVertical>
        </ScrollView>
    )
}
