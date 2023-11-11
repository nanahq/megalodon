import { ImageSourcePropType} from "react-native";
import ShawarmaIcon from '@assets/app/shawarma.png'
import LunchIcon from '@assets/app/lunch.png'
import ChickenIcon from '@assets/app/chicken.png'
import CakesIcon from '@assets/app/cakes.png'
import HomemadeIcon from '@assets/app/homemade.png'
import IceCreamIcon from '@assets/app/icecream.png'

export type CategoryTags = 'Food' | 'Ice Cream' | 'Homemade' | 'Cakes' | 'Chicken' | 'Shawarma'
export const MappedTags: Record<CategoryTags, ImageSourcePropType> = {
    "Cakes": CakesIcon,
    "Ice Cream": IceCreamIcon,
    'Chicken': ChickenIcon,
    'Homemade': HomemadeIcon,
    'Shawarma': ShawarmaIcon,
    'Food': LunchIcon
}

export const TagsWithImages: Array<{name: CategoryTags, icon: ImageSourcePropType}> = [
    {
        name: 'Food',
        icon: LunchIcon
    },
    {
        name: 'Ice Cream',
        icon: IceCreamIcon
    },
    {
        name: 'Shawarma',
        icon: ShawarmaIcon
    }
]
