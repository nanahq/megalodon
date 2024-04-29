import {ListingApprovalStatus, ListingCategoryI, ListingMenuI, ScheduledListingI} from "@nanahq/sticky";
import {Pressable, ScrollView, Text, View} from "react-native";
import {tailwind} from "@tailwind";
import React, {memo} from "react";
import FastImage from "react-native-fast-image";
import {formatRelativeDate} from "../../../../../../utils/DateFormatter";

const _VendorCategorySection: React.FC<{category: ListingCategoryI, vendorOperationStatus?: boolean, warningCallback?: () => void, onPress: (listing:ListingMenuI) => void}> = (props) => {

     return (
        <View style={tailwind('my-5 flex-1')}>
            <View style={tailwind('flex flex-col')}>
                <View style={tailwind('flex flex-row items-center')}>
                    <Text style={tailwind('uppercase font-bold text-black')}>{props.category.name}</Text>
                    {props.category.type === 'PRE_ORDER' && (
                        <View style={tailwind('bg-primary-500 py-0.5 px-1 rounded-full ml-2')}>
                            <Text style={tailwind('text-white text-xs text-center')}>Pre-orders</Text>
                        </View>
                    )}
                </View>
                {props.category.type === 'PRE_ORDER' && (
                    <Text style={tailwind('text-xs text-gray-500 mt-2')}>This menu is only available on a scheduled basis. subscribe to vendor and we will let you know when menu is available</Text>
                )}
            </View>
            <View style={tailwind('flex flex-col')}>
                {props.category.listingsMenu.filter(menu => menu.status === ListingApprovalStatus.APPROVED && menu.price !== undefined).map((listing, index) => (
                    <VendorMenuCard
                        disabled={props.category.type === 'PRE_ORDER'}
                        menu={listing} key={index}
                        onPress={() => props.onPress(listing)}
                    />
                ))}
            </View>
        </View>
    )
}
 export const VendorCategorySection = memo(_VendorCategorySection)
const VendorMenuCard: React.FC<{menu: ListingMenuI, onPress: () => void, disabled: boolean}> = (props) => {
     return (
         <Pressable disabled={props.disabled} onPress={props.onPress} style={tailwind('flex flex-row items-center py-4 justify-between')}>
            <View style={tailwind('flex flex-col w-2/3')}>
                <Text style={tailwind('')}>{props.menu.name}</Text>
                <Text style={tailwind('text-brand-gray-700 my-2 text-sm')} ellipsizeMode="tail" numberOfLines={3}>{props.menu.desc}</Text>
                <Text style={tailwind('mt-1 font-bold')}>₦{props.menu.price}</Text>
            </View>
             <View style={tailwind('w-1/3 ml-8')}>
                 <FastImage
                     source={{uri: props.menu.photo, priority: FastImage.priority.high}}
                     style={[tailwind('rounded-lg'), { aspectRatio: 1, width: 80}]}
                     resizeMode={FastImage.resizeMode.cover}
                 />
             </View>
         </Pressable>
     )
}

const _ScheduledMenuSection: React.FC<{menu: ScheduledListingI[], onPress: (listing:ListingMenuI) => void}> = (props) => {
     return (
         <View>
             <View style={tailwind('mb-3 mt-5')}>
                 <Text style={tailwind('font-bold text-black')}>Order now for Later!</Text>
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
                 <FastImage source={{uri: props.menu.listing.photo, priority: FastImage.priority.high }} style={[tailwind('rounded'), {aspectRatio: 10/8, width: 160}]}  resizeMode="cover"   />
                <View style={tailwind('mt-1')}>
                    <Text style={tailwind('')} numberOfLines={1} ellipsizeMode="tail">{props.menu.listing.name}</Text>
                    <Text style={tailwind('text-sm')}>{props.menu.remainingQuantity} servings left</Text>
                    <Text style={tailwind('text-black')}>₦{props.menu.listing.price}</Text>
                </View>
             </View>
             {props.menu.soldOut ? (
                 <View style={tailwind('bg-red-600  rounded-r-lg p-1 absolute top-0')}>
                     <Text style={tailwind('text-xs text-white')}>Sold out!</Text>
                 </View>
                 ) : (
                 <View style={tailwind('bg-purple-400  rounded-r-lg p-1 absolute top-0')}>
                     <Text style={tailwind('text-xs text-white')}>Available {chosenDate}</Text>
                 </View>
             )}
         </Pressable>
     )
}
