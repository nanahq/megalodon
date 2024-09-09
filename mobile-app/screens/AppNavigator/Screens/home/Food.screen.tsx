import {Dimensions, ScrollView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import {SafeAreaView} from "react-native-safe-area-context";
import {IconButton} from "@components/commons/buttons/IconButton";
import {SearchBar} from "@screens/AppNavigator/Screens/home/components/SearchBar";
import React from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageFood from "@assets/ads/cravings.png";
import {HomeSection, HomeSectionVertical} from "@screens/AppNavigator/Screens/home/components/HomeSection";
import {FlashList} from "@shopify/flash-list";
import {useAppSelector} from "@store/index";
import {VendorCard, VendorCardFullWidth} from "@screens/AppNavigator/Screens/modals/components/VendorCard";

export const FoodScreen: React.FC= () => {
    const {height} = Dimensions.get('window')
    const { hompage} = useAppSelector(state => state.listings)

    function PopularRenderItem({item}: any) {
        return <VendorCard style={tailwind('mr-2.5')} vendor={item} height={300}  />
    }

    function RenderItem ({item}: any) {
        return <VendorCardFullWidth  style={tailwind('mb-2')} vendor={item}/>
    }
    return (
        <View style={tailwind('flex-1 bg-white pt-4 px-5')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height,}}
            >
            <SearchBar />
            <AdvertComponent source={AdImageFood} />
                {hompage?.mostPopularVendors !== undefined && hompage?.mostPopularVendors.length > 0 && (
                    <HomeSection label="Top Rated Restaurants">
                        <FlashList
                            data={hompage?.mostPopularVendors}
                            renderItem={(props) => <PopularRenderItem {...props} />}
                            keyExtractor={item => item._id}
                            horizontal={true as any}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            estimatedItemSize={10}
                        />
                    </HomeSection>
                )}
                <HomeSectionVertical label="All Restaurants">
                    <FlashList
                        showsVerticalScrollIndicator={false}
                        contentContainerStyle={tailwind('px-0')}
                        data={hompage?.allVendors as any}
                        renderItem={(props) => <RenderItem {...props} />}
                        keyExtractor={item => item._id}
                        estimatedItemSize={100}
                    />
                </HomeSectionVertical>
            </ScrollView>
        </View>

    )
}
