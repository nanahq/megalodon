import { View, Text, StyleProp, ViewProps} from 'react-native'
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {PropsWithChildren} from "react";

type VendorsCardProps = {
    fullWidth?: boolean
}
export function VendorsCard (props: VendorsCardProps): JSX.Element {
    return (
        <View style={{
            width: 250,
            height: 180,
            ...tailwind('bg-brand-gray-600 border-0.5 border-brand-black-500 mr-3.5 flex flex-col', {'w-full': props.fullWidth})
        }}>
            {/* <Image */}
            {/*     source={FoodImage} */}
            {/*     style={ */}
            {/*     [tailwind('w-full'), {height: 100}] */}
            {/* }/> */}
            <View style={tailwind('w-full p-2')}>
               <View style={tailwind('flex flex-row justify-between items-center w-full')}>
                   <Text testID="VendorsCard.Vendor.Name" style={tailwind('font-semibold text-base text-brand-black-500')}>Esha Kitchen</Text>
                   <IconComponent testID="VendorsCard.Vendor.FavoriteButton" iconType="Feather" name="heart" size={24} style={tailwind('font-light text-base text-brand-gray-700')} />
               </View>
                <View style={tailwind('mt-1 flex flex-col w-full')}>
                    <TagsRow containerStyle={tailwind('flex flex-row items-center')} >
                        <VendorTags tag="Lunch"/>
                        <VendorTags tag="African"/>
                        <VendorTags tag="Snack"/>
                    </TagsRow>
                    <VendorReview ratings={4.5} totalReviews={1000} />
                </View>
            </View>
        </View>
    )
}


export function VendorTags ({tag}: {tag: string }): JSX.Element {
    return (
        <Text style={tailwind('text-sm text-brand-gray-800 font-light mr-1 ')}>{tag}</Text>
    )
}

export function TagsRow ({containerStyle, children}: PropsWithChildren<{containerStyle: StyleProp<ViewProps>}>): JSX.Element {
    return (
        <View style={containerStyle}>
            {children}
        </View>
    )
}


export function VendorReview ({ratings, totalReviews}: {ratings: number, totalReviews: number}): JSX.Element {
    return (
        <View style={tailwind('flex flex-row items-center self-end')}>
            <View style={tailwind('flex flex-row items-center')}>
                <Text style={tailwind('text-sm font-semibold')}>{ratings}</Text>
                <IconComponent iconType="Feather" name="thumbs-up"  style={tailwind('text-brand-black-500')} size={16}/>
            </View>
            <Text style={tailwind('text-sm text-brand-gray-700 ml-0.5')}>{`(${totalReviews}+)`}</Text>
        </View>
    )
}
