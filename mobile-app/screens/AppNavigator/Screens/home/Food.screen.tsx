import {Dimensions, Pressable, ScrollView, Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import { useSafeAreaInsets} from "react-native-safe-area-context";
import {SearchBar} from "@screens/AppNavigator/Screens/home/components/SearchBar";
import React from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageFood from "@assets/ads/cravings.png";
import {HomeSection, HomeSectionVertical} from "@screens/AppNavigator/Screens/home/components/HomeSection";
import {FlashList} from "@shopify/flash-list";
import {useAppSelector} from "@store/index";
import {VendorCard, VendorCardFullWidth} from "@screens/AppNavigator/Screens/modals/components/VendorCard";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
import {User} from "lucide-react-native";
import {useNavigation} from "@react-navigation/native";
import {ListingMenuCard} from "@screens/AppNavigator/Screens/modals/components/ListingCard";

export const FoodScreen: React.FC= () => {
    const {height} = Dimensions.get('window')
    const navigation = useNavigation()
    const insert = useSafeAreaInsets()
    const { hompage} = useAppSelector(state => state.listings)

    function PopularRenderItem({item}: any) {
        return <VendorCard style={tailwind('mr-2.5')} vendor={item} height={300}  />
    }

    function RenderItem ({item}: any) {
        return <VendorCardFullWidth  style={tailwind('mb-5')} vendor={item}/>
    }
    function   ListingRenderItem ({item}: any) {
        return  <ListingMenuCard listing={item} />
    }

    return (
        <View style={tailwind('flex-1 bg-white pt-4 px-5')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height}}
            >
                <View style={[tailwind('flex flex-row items-center justify-between'), {marginTop: insert.top + (insert.top * 0.2)}]}>
                    <View>
                        <Text style={tailwind('text-sm text-gray-500')}>Deliver now</Text>
                        <Text style={tailwind('text-lg')}>Kano, Nigeria</Text>
                    </View>
                    <Pressable style={tailwind('bg-gray-100 border-2 border-primary-100 rounded-full p-1')} onPress={() => navigation?.navigate(AppScreenName.PROFILE)}>
                        <User
                            style={tailwind('')}
                            size={30}
                            color={getColor('gray-400')}
                        />
                    </Pressable>
                </View>
            <SearchBar />
            <AdvertComponent source={AdImageFood} />
                {hompage?.scheduledListingsTomorrow !== undefined && hompage?.scheduledListingsTomorrow.length > 0 && (
                    <HomeSection label="Pre-orders available tomorrow">
                        <FlashList
                            data={hompage.scheduledListingsTomorrow}
                            renderItem={(props) => <ListingRenderItem {...props} />}
                            keyExtractor={item => item._id}
                            horizontal={true as any}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            estimatedItemSize={10}
                            onScrollEndDrag={() => void analytics.track('SCROLL-SCHEDULED-LISTING')}
                        />
                    </HomeSection>
                )}
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
