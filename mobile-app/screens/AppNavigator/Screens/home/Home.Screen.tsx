import {Dimensions, ScrollView, View, Text, TextInput} from "react-native";
import React, {useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from "@tailwind";
import {CategorySection} from "@screens/AppNavigator/Screens/modals/components/Tags";
import {HomeSection, HomeSectionVertical} from "@screens/AppNavigator/Screens/home/components/HomeSection";
import {RootState, useAppDispatch, useAppSelector} from "@store/index";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {VendorCard} from "@screens/AppNavigator/Screens/modals/components/VendorCard";
import {fetchSubscriptions} from "@store/vendors.reducer";
import {ListingMenuCard} from "@screens/AppNavigator/Screens/modals/components/ListingCard";
import {FlashList} from "@shopify/flash-list";
import {useAnalytics} from "@segment/analytics-react-native";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {fetchHomaPage} from "@store/listings.reducer";
import {IconButton} from "@components/commons/buttons/IconButton";
import {SearchBar} from "@screens/AppNavigator/Screens/home/components/SearchBar";
import {AdvertComponent, HomepageAdvert} from "@screens/AppNavigator/Screens/home/components/Advert";
import AdImage from '@assets/ads/free-delivery.png'

const {height} = Dimensions.get('window')
export function HomeScreen (): JSX.Element {
    const {hasFetchedProfile, profile} = useAppSelector((state: RootState) => state.profile)
    const { hasFetchedListings, hompage} = useAppSelector(state => state.listings)
    const dispatch = useAppDispatch()
    const analytics = useAnalytics()

    useEffect(() => {
        void analytics.screen(HomeScreenName.HOME)
        if (!hasFetchedProfile || !profile) {
            return
        }

        dispatch(fetchSubscriptions(profile._id))
        dispatch(fetchHomaPage(profile.location as any) as any)

    }, [hasFetchedProfile, profile._id])


    if (!hasFetchedListings) {
       return <LoaderComponentScreen />
    }

    function PopularRenderItem({item}: any) {
        return <VendorCard style={tailwind('mr-2.5')} vendor={item} height={300}  />
    }

    function   ListingRenderItem ({item}: any) {
        return  <ListingMenuCard listing={item} />
    }


    const scrollAnalytics = async () => {
        await analytics.track('SCROLL-HOMEPAGE')
    }


    return (
        <View
            style={tailwind('flex-1 bg-white pt-4 px-5')}

        >
            <ScrollView
                showsVerticalScrollIndicator={false}
                onScrollEndDrag={() => scrollAnalytics()}
                style={{height,}}
            >
                <SearchBar />
                <CategorySection />
                <AdvertComponent source={AdImage} />
                {hompage?.mostPopularVendors !== undefined && hompage?.mostPopularVendors.length > 0 && (
                    <HomeSection label="Top Rated Vendors">
                        <FlashList
                            data={hompage.mostPopularVendors}
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
                {hompage?.instantDelivery !== undefined && hompage?.instantDelivery.length > 0 && (
                    <HomeSection label="Instant Delivery">
                        <FlashList
                            data={hompage.instantDelivery}
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

                {hompage?.homeMadeChefs !== undefined && hompage?.homeMadeChefs.length > 0 && (
                    <HomeSection label="Homemade chefs">
                        <FlashList
                            data={hompage.homeMadeChefs}
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

            </ScrollView>

        </View>

    )
}
