import {ListingCategoryI, ListingMenuI, ScheduledListingI} from "@nanahq/sticky";
import {View, Text, Image, Pressable, ScrollView} from "react-native";
import {tailwind} from "@tailwind";
import React,  {memo} from "react";
import {formatRelativeDate} from "../../../../../../utils/DateFormatter";

 const _VendorCategorySection: React.FC<{category: ListingCategoryI, onPress: (listing:ListingMenuI) => void}> = (props) => {

     return (
        <View style={tailwind('my-5 flex-1')}>
            <View style={tailwind('flex flex-row items-center')}>
             <Text style={tailwind('text-2xl font-bold text-black')}>{props.category.name}</Text>
                {props.category.type === 'PRE_ORDER' && (
                    <View style={tailwind('bg-primary-500 p-1 rounded-full ml-2')}>
                        <Text style={tailwind('text-white text-xs text-center')}>Pre-orders</Text>
                    </View>
                )}
            </View>
            <View style={tailwind('flex flex-col')}>
                {props.category.listingsMenu.map((listing, index) => (
                    <VendorMenuCard disabled={props.category.type === 'PRE_ORDER'} menu={listing} key={index} onPress={() => props.onPress(listing)} />
                ))}
            </View>
        </View>
    )
}
 export const VendorCategorySection = memo(_VendorCategorySection)
const VendorMenuCard: React.FC<{menu: ListingMenuI, onPress: () => void, disabled: boolean}> = (props) => {
     return (
         <Pressable  onPress={props.onPress} style={tailwind('flex flex-row items-center py-4 justify-between')}>
            <View style={tailwind('flex flex-col w-2/3')}>
                <Text style={tailwind('font-bold text-sm ')}>{props.menu.name}</Text>
                <Text style={tailwind('text-sm font-bold')}>₦{props.menu.price}</Text>
                <Text style={tailwind('text-brand-gray-700 my-2')}>{props.menu.desc}</Text>
            </View>
             <View style={tailwind('w-1/3 ml-8')}>
                 <Image source={{uri: props.menu.photo, cache: 'force-cache'}} style={tailwind('rounded-lg')}  resizeMode="cover" height={80} width={80}  />
             </View>
         </Pressable>
     )
}

const _ScheduledMenuSection: React.FC<{menu: ScheduledListingI[], onPress: (listing:ListingMenuI) => void}> = (props) => {
     return (
         <View>
             <View style={tailwind('mb-3 mt-5')}>
                 <Text style={tailwind('text-2xl font-bold text-black')}>Order now for Later!</Text>
             </View>
             <View style={{height: 200}}>
                 <ScrollView
                     horizontal={true as any}
                     showsHorizontalScrollIndicator={false}
                 >
                     {props.menu.map((listing, index) => (
                         <ScheduledMenuCard menu={listing} onPress={() => props.onPress(listing.listing)} key={index} />
                     ))}
                 </ScrollView>
             </View>
         </View>
     )
}
export const ScheduledMenuSection = memo(_ScheduledMenuSection)
const ScheduledMenuCard: React.FC<{menu: ScheduledListingI, onPress: () => void}> = (props) => {
    const chosenDate = formatRelativeDate(props.menu.availableDate)
    return (
         <Pressable disabled={props.menu.soldOut} onPress={props.onPress} style={[tailwind('mr-4 relative'), {width: 180}]}>
             <View>
                 <Image source={{uri: props.menu.listing.photo, }} style={tailwind('rounded')}  resizeMode="cover" height={100} width={180}  />
                <View style={tailwind('mt-2')}>
                    <Text style={tailwind('text-sm  font-bold')}>{props.menu.listing.name}</Text>
                    <Text style={tailwind('text-sm')}>{props.menu.remainingQuantity} servings left</Text>
                    <Text style={tailwind('text-primary-500 ')}>₦{props.menu.listing.price}</Text>
                </View>
             </View>
             {props.menu.soldOut ? (
                 <View style={tailwind('bg-red-600  rounded-r-lg p-1 absolute top-0')}>
                     <Text style={tailwind('text-xs text-white')}>Sold out!</Text>
                 </View>
                 ) : (
                 <View style={tailwind('bg-green-600  rounded-r-lg p-1 absolute top-0')}>
                     <Text style={tailwind('text-xs text-white')}>Available on {chosenDate}</Text>
                 </View>
             )}
         </Pressable>
     )
}
