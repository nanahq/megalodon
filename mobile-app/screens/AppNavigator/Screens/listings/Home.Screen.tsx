import {Dimensions, SafeAreaView, View} from "react-native";
import {useEffect} from "react";
import * as SplashScreen from 'expo-splash-screen'
import {ScrolledView} from "@components/views/ScrolledView";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {tailwind} from "@tailwind";
import {LocationBarComponent} from "@screens/AppNavigator/components/LocationBarComponent";
import {SearchBar} from "@screens/AppNavigator/components/SearchBar";
import {VendorsList} from "@screens/AppNavigator/Screens/listings/components/home/vendors/VendorsList";
import {useLogger} from "@contexts/NativeLoggingProvider";

const {height} = Dimensions.get('screen')
export function ListingsScreen (): JSX.Element {
    const {top: topInsert, bottom: bottomInsert} = useSafeAreaInsets()

const logger = useLogger()
    useEffect(() => {
        setTimeout(() => {
            SplashScreen.hideAsync().catch(logger.error);
        });
    }, []);


    return (
           <SafeAreaView style={{paddingTop: topInsert + 88, paddingBottom: bottomInsert + 200 }}>
               <ScrolledView
                   testId="ListingsScreen.View"
                   contentContainerStyle={{backgroundColor: '#F5F5F5', height }}
               >
               <View style={tailwind('px-4')}>
                   <LocationBarComponent />
                   <SearchBar
                       testID="ListingsScreen.Search"
                       containerStyle={tailwind('mt-2')}
                   />
               </View>
               {/* <View style={tailwind('mt-10')}> */}
               {/*     <CategoryScrollable */}
               {/*         tesID="ListingsScreen.Category.Favorites" */}
               {/*         heading="Top Picks" */}
               {/*         headingStyle={tailwind('px-4')} */}
               {/*         // containerStyle={tailwind('px-4')} */}
               {/*     > */}
               {/*         <VendorsCard /> */}
               {/*         <VendorsCard /> */}
               {/*         <VendorsCard /> */}
               {/*     </CategoryScrollable> */}
               {/*     <CategoryScrollable */}
               {/*         tesID="ListingsScreen.Category.Favorites" */}
               {/*         heading="Most Popular" */}
               {/*         headingStyle={tailwind('px-4')} */}
               {/*         // containerStyle={tailwind('px-4')} */}
               {/*     > */}
               {/*         <VendorsCard /> */}
               {/*         <VendorsCard /> */}
               {/*         <VendorsCard /> */}
               {/*     </CategoryScrollable> */}
               {/*     <CategoryScrollable */}
               {/*         tesID="ListingsScreen.Category.Favorites" */}
               {/*         heading="Satisfying Lunch" */}
               {/*         headingStyle={tailwind('px-4')} */}
               {/*         // containerStyle={tailwind('px-4')} */}
               {/*     > */}
               {/*         <VendorsCard /> */}
               {/*         <VendorsCard /> */}
               {/*         <VendorsCard /> */}
               {/*     </CategoryScrollable> */}
               {/* </View> */}
               <VendorsList />
        </ScrolledView>
           </SafeAreaView>
    )
}
