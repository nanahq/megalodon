import React from "react";
import { Pressable, View, Text} from "react-native";
import OneStar from '@assets/app/emojis/1.svg'
import TwoStar from '@assets/app/emojis/2.svg'
import ThreeStar from '@assets/app/emojis/3.svg'
import FourStar from '@assets/app/emojis/4.svg'
import FiveStar from '@assets/app/emojis/5.svg'
import {tailwind} from "@tailwind";

const ratings = [
    {
     icon: OneStar,
     label: 'Terrible',
     rating: 1
    },
    {
        icon: TwoStar,
        label: 'Bad',
        rating: 2
    },
    {
        icon: ThreeStar,
        label: 'Okay',
        rating: 3
    },
    {
        icon: FourStar,
        label: 'Good',
        rating: 4
    },
    {
        icon: FiveStar,
        label: 'Awesome',
        rating: 5
    },
]
interface RatingRowProps {
    onPress: (rating: number) => void

    currentRating: number
}
export const RatingRow: React.FC<RatingRowProps> = (props) => {
    return (
        <View style={tailwind('flex flex-row items-center justify-between w-full')}>
            {ratings.map(rating => (
                <Pressable
                    onPress={() => props.onPress(rating.rating)}
                    key={rating.rating}
                >
                   <View style={tailwind('flex flex-col items-center')}>
                       <View
                           style={[tailwind('rounded-full flex flex-row items-center justify-center', {'bg-primary-500': rating.rating === props.currentRating, 'bg-primary-200': rating.rating !== props.currentRating}), {width: 50, height: 50}]}
                       >
                           <IconMapper rating={rating.rating} />
                       </View>
                       <Text style={tailwind('text-center text-brand-gray-700 mt-2')}>{rating.label}</Text>
                   </View>
                </Pressable>
            ))}
        </View>
    )
}


const IconMapper: React.FC<{rating: number}> = (props) => {
    switch (props.rating) {
        case 1:
            return <OneStar  style={{aspectRatio: 1, width: 30}} />
        case 2:
            return <TwoStar  style={{aspectRatio: 1, width: 30}} />
        case 3:
            return <ThreeStar  style={{aspectRatio: 1, width: 30}} />
        case 4:
            return <FourStar  style={{aspectRatio: 1, width: 30}} />
        case 5:
            return <FiveStar  style={{aspectRatio: 1, width: 30}} />
    }
}
