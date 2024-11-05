import {Dimensions, ScrollView, View, Text, Pressable} from "react-native";
import React, {useEffect} from "react";
import {SafeAreaView, useSafeAreaInsets} from "react-native-safe-area-context";
import {getColor, tailwind} from "@tailwind";
import {HomeSection, HomeSectionVertical} from "@screens/AppNavigator/Screens/home/components/HomeSection";
import { useAppSelector} from "@store/index";
import {VendorCard, VendorCardFullWidth} from "@screens/AppNavigator/Screens/modals/components/VendorCard";
import {ListingMenuCard} from "@screens/AppNavigator/Screens/modals/components/ListingCard";
import {FlashList} from "@shopify/flash-list";
import {useAnalytics} from "@segment/analytics-react-native";
import {SearchBar} from "@screens/AppNavigator/Screens/home/SearchBar";
import {CartIcon} from "@screens/AppNavigator/Screens/home/components/CartIcon";
import {useNavigation} from "@react-navigation/native";
import {StatusBar} from "expo-status-bar";
import {useProfile} from "@contexts/profile.provider";
import {useListings} from "@contexts/listing.provider";
import {NotfoundLocation} from "@screens/AppNavigator/components/NotfoundLocation";
import {useLocation} from "@contexts/location.provider";
import {MapPin, User} from 'lucide-react-native'
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {VendorUserI} from "@nanahq/sticky";
import {useCart} from "@contexts/cart.provider";
import {AppScreenName} from "@screens/AppNavigator/ScreenName.enum";
const {height, width} = Dimensions.get('window')
export function HomeScreen (): JSX.Element {
    const {isWithinSupportedCities, currentCity} = useLocation()
    const { cart } = useCart()
    const navigation = useNavigation()
    const {listings} = useListings()
    const analytics = useAnalytics()
    useEffect(() => {
        void analytics.screen(HomeScreenName.HOME)


    }, [])


    function PopularRenderItem({item}: any) {
        return <VendorCard style={tailwind('mr-2.5')} vendor={item} height={300}  />
    }

    function RenderItem ({item}: any) {
        return <VendorCardFullWidth  style={tailwind('mb-5')} vendor={item}/>
    }

    function   ListingRenderItem ({item}: any) {
        return  <ListingMenuCard listing={item} />
    }

    const scrollAnalytics = async () => {
        await analytics.track('SCROLL-HOMEPAGE')
    }


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
        <SafeAreaView
            style={tailwind('flex-1 relative bg-white pt-4')}
        >
            <StatusBar style={tailwind('bg-primary-100 h-full w-full')} backgroundColor={getColor('primary-100')} />
            <View style={tailwind('px-5 pb-5 flex flex-col w-full ')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <View style={tailwind('flex flex-row items-center')}>
                        <MapPin size={22} style={tailwind('text-slate-900')} />
                        <Text style={tailwind('font-normal text-base text-slate-900')}>{currentCity}</Text>
                    </View>
                    <Pressable style={tailwind('bg-gray-50 border-2 border-slate-600 rounded-full p-2')} onPress={() => navigation?.navigate(AppScreenName.PROFILE)}>
                        <User
                            size={20}
                            color={getColor('slate-900')}
                        />
                    </Pressable>
                </View>
                <SearchBar />
            </View>
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScrollEndDrag={() => scrollAnalytics()}
                style={{height,}}
            >
                <View style={tailwind('px-5')}>
                    {/* <AdvertComponent source={AdImage} /> */}
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
                       <HomeSectionVertical label="All Restaurants and Stores">
                           <FlashList
                               showsVerticalScrollIndicator={false}
                               data={listings?.allVendors?.sort((a, b) => a.ratings.totalReviews - b.ratings.totalReviews) as any ?? []}
                               renderItem={(props) => <RenderItem {...props} />}
                               keyExtractor={item => item._id}
                               estimatedItemSize={100}
                           />
                       </HomeSectionVertical>
                </View>


            </ScrollView>
            {cart?.hasItemsInCart && (
                <CartIcon/>
            )}
        </SafeAreaView>

    )
}
