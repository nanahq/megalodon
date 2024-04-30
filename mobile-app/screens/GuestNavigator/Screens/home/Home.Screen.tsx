import {Dimensions, ScrollView} from "react-native";
import React, {useEffect} from "react";
import {SafeAreaView} from "react-native-safe-area-context";
import {tailwind} from "@tailwind";
import {CategorySection} from "@screens/AppNavigator/Screens/modals/components/Tags";
import {HomeSection, HomeSectionVertical} from "@screens/AppNavigator/Screens/home/components/HomeSection";
import { useAppSelector} from "@store/index";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {VendorCard} from "@screens/AppNavigator/Screens/modals/components/VendorCard";
import {ListingMenuCard} from "@screens/AppNavigator/Screens/modals/components/ListingCard";
import {FlashList} from "@shopify/flash-list";
import {ExploreSections} from "@screens/AppNavigator/Screens/home/components/ExploreSections";
import {useAnalytics} from "@segment/analytics-react-native";

const {height} = Dimensions.get('window')
export function HomeScreen (): JSX.Element {
    const { hasFetchedListings, hompage} = useAppSelector(state => state.listings)
    const analytics = useAnalytics()


    if (!hasFetchedListings) {
       return <LoaderComponentScreen />
    }

    function PopularRenderItem({item}: any) {
        return <VendorCard style={tailwind('mr-5')} vendor={item} height={300}  />
    }

    function   ListingRenderItem ({item}: any) {
        return  <ListingMenuCard listing={item} />
    }


    const scrollAnalytics = async () => {
        await analytics.track('SCROLL-HOMEPAGE')
    }

    function RenderItem ({item}: any) {
        return <VendorCard  fullWidth={true as any} height={300} style={tailwind('mb-10')} vendor={item}/>
    }
    return (
           <SafeAreaView style={tailwind('flex-1 bg-white')}>
               <ScrollView
                   onScrollEndDrag={() => scrollAnalytics()}
                   style={{backgroundColor: 'rgba(230, 230, 230, 0.4)', height,}}
               >
                   <CategorySection />
                   <ExploreSections vendors={hompage?.allVendors.slice(0, 10) ?? []} />
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

                   <HomeSectionVertical label="All Vendors">
                       <FlashList
                           showsVerticalScrollIndicator={false}
                           contentContainerStyle={tailwind('px-0')}
                           data={hompage?.allVendors}
                           renderItem={(props) => <RenderItem {...props} />}
                           keyExtractor={item => item._id}
                           estimatedItemSize={100}
                       />
                   </HomeSectionVertical>
                 </ScrollView>
           </SafeAreaView>
    )
}
