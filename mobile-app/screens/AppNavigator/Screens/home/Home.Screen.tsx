import {Dimensions, SafeAreaView, ScrollView} from "react-native";
import { useMemo} from "react";
import {useSafeAreaInsets} from "react-native-safe-area-context";
import {tailwind} from "@tailwind";
import {HomeHeader} from "@screens/AppNavigator/Screens/modals/components/Header";
import {CategorySection} from "@screens/AppNavigator/Screens/modals/components/Tags";
import {HomeSection} from "@screens/AppNavigator/Screens/modals/components/HomeSection";
import {RootState, useAppSelector} from "@store/index";
import {LoaderComponentScreen} from "@components/commons/LoaderComponent";
import {VendorCard} from "@screens/AppNavigator/Screens/modals/components/VendorCard";
import * as Device from 'expo-device'


const {height} = Dimensions.get('screen')
export function HomeScreen (): JSX.Element {
    const {top: topInsert} = useSafeAreaInsets()
    const {hasFetchedVendor, vendors} = useAppSelector((state: RootState) => state.vendors)


    const popular = useMemo(() => {
        if (vendors !== undefined && hasFetchedVendor) {
            return vendors?.map(v => v) // implement filter based on reviews
        }
    }, [hasFetchedVendor, vendors])

    if (!hasFetchedVendor) {
       return <LoaderComponentScreen />
    }

    const top = Device.osName === 'Android' ? topInsert + 20 : 10

    return (
           <SafeAreaView style={tailwind('flex-1 bg-white')}>
               <ScrollView
                   style={{backgroundColor: 'rgba(230, 230, 230, 0.4)', height, top,}}
               >
                    <HomeHeader />
                   <CategorySection />
               <HomeSection label="Popular Near You">
                   {popular !== undefined && popular.map((vendor, index) => (
                       <VendorCard vendor={vendor} key={index} />
                   ))}
               </HomeSection>
                   <HomeSection label="Homemade Pre-Orders">
                       {popular !== undefined && popular.map((vendor, index) => (
                           <VendorCard vendor={vendor} key={index} />
                       ))}
                   </HomeSection>
                   <HomeSection label="Fastest Delivery">
                       {popular !== undefined && popular.map((vendor, index) => (
                           <VendorCard vendor={vendor} key={index} />
                       ))}
                   </HomeSection>
        </ScrollView>
           </SafeAreaView>
    )
}
