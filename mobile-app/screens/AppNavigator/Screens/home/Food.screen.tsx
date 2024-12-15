import {Dimensions, Pressable, ScrollView, Text, View} from "react-native";
import {getColor, tailwind} from "@tailwind";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {SearchBar} from "@screens/AppNavigator/Screens/home/SearchBar";
import React, {useEffect} from "react";
import {AdvertComponent} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImageFood from "@assets/ads/cravings.png";
import {HomeSection, HomeSectionVertical} from "@screens/AppNavigator/Screens/home/components/HomeSection";
import {FlashList} from "@shopify/flash-list";
import {VendorCard, VendorCardFullWidth} from "@screens/AppNavigator/Screens/modals/components/VendorCard";
import {MapPin} from "lucide-react-native";
import {ListingMenuCard} from "@screens/AppNavigator/Screens/modals/components/ListingCard";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
import {useLocation} from "@contexts/location.provider";
import {useListings} from "@contexts/listing.provider";
import {StatusBar} from "expo-status-bar";
import {VendorUserI} from "@nanahq/sticky";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {useAnalytics} from "@segment/analytics-react-native";
import {useNavigation} from "@react-navigation/native";

export const FoodScreen: React.FC= () => {
    const {height} = Dimensions.get('window')
    const {listings} = useListings()
    const {currentCity} = useLocation()
    const analytics = useAnalytics()
    const navigation = useNavigation()


    useEffect(() => {
        void analytics.screen(HomeScreenName.FOOD_SCREEN)
    }, [])
    function PopularRenderItem({item}: any) {
        return <VendorCard style={tailwind('mr-2.5')} vendor={item} height={400}  />
    }

    function RenderItem ({item}: any) {
        return <VendorCardFullWidth  style={tailwind('mb-5')} vendor={item}/>
    }
    function   ListingRenderItem ({item}: any) {
        return  <ListingMenuCard listing={item} />
    }
    const {isWithinSupportedCities} = useLocation()

    if(!isWithinSupportedCities) {
        return <NotfoundLocation />
    }

    const handleGoToSection = (heading: string, items: VendorUserI[]) => {
        navigation.navigate(HomeScreenName.CATEGORIES_SCREEN, {
            heading,
            items
        })
    }

    return (
        <SafeAreaView style={tailwind('flex-1 bg-white pt-4')}>
            <ScrollView
                showsVerticalScrollIndicator={false}
                style={{height}}
            >
                <StatusBar style={tailwind('bg-primary-100 h-full w-full')} backgroundColor={getColor('primary-100')} />
                <View style={tailwind('px-5 flex flex-col w-full ')}>
                    <View style={tailwind('flex flex-row items-center')}>
                        <MapPin size={16} style={tailwind('text-slate-900 text-primary-100')} />
                        <Text style={tailwind('font-light text-sm text-slate-900')}>{currentCity}</Text>
                    </View>
                    <SearchBar />
                </View>
            <View style={tailwind('px-5')}>
                <AdvertComponent source={AdImageFood} />
                {listings?.mostPopularVendors !== undefined && listings?.mostPopularVendors.length > 0 && (
                    <HomeSection
                        onPress={() =>handleGoToSection("Top Rated Vendors", listings?.mostPopularVendors ?? [])}
                        label="Top Rated Vendors">
                        <FlashList
                            data={listings.mostPopularVendors as any}
                            renderItem={(props) => <PopularRenderItem {...props} />}
                            keyExtractor={item => item._id}
                            horizontal={true as any}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            estimatedItemSize={10}
                            onScrollEndDrag={() => void analytics.track('SCROLL-TOP-RATED-VENDORS')}
                        />
                    </HomeSection>
                )}
                {listings?.instantDelivery !== undefined && listings?.instantDelivery.length > 0 && (
                    <HomeSection
                        onPress={() =>handleGoToSection("Instant Delivery", listings?.instantDelivery ?? [])}
                        label="Instant Delivery"
                    >
                        <FlashList
                            data={listings.instantDelivery as any}
                            renderItem={(props) => <PopularRenderItem {...props} />}
                            keyExtractor={item => item._id}
                            horizontal={true as any}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            estimatedItemSize={10}
                            onScrollEndDrag={() => void analytics.track('SCROLL-INSTANT-DELIVERY')}
                        />
                    </HomeSection>
                )}

                {listings?.homeMadeChefs !== undefined && listings?.homeMadeChefs.length > 0 && (
                    <HomeSection
                        onPress={() =>handleGoToSection("Homemade chefs", listings?.homeMadeChefs ?? [])}
                        label="Homemade chefs"
                    >
                        <FlashList
                            data={listings.homeMadeChefs as any}
                            renderItem={(props) => <PopularRenderItem {...props} />}
                            keyExtractor={item => item._id}
                            horizontal={true as any}
                            showsHorizontalScrollIndicator={false}
                            showsVerticalScrollIndicator={false}
                            estimatedItemSize={10}
                            onScrollEndDrag={() => void analytics.track('SCROLL-HOMEMADE-VENDORS')}
                        />
                    </HomeSection>
                )}
                {listings?.mostPopularVendors !== undefined && listings?.mostPopularVendors.length > 0 && (
                    <HomeSection label="Top Rated Restaurants">
                        <FlashList
                            data={listings?.mostPopularVendors ?? [] as any}
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
                        data={listings?.allVendors as any}
                        renderItem={(props) => <RenderItem {...props} />}
                        keyExtractor={item => item._id}
                        estimatedItemSize={100}
                    />
                </HomeSectionVertical>
            </View>
            </ScrollView>
        </SafeAreaView>

    )
}
