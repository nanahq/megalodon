import { ImageSourcePropType} from "react-native";
import ShawarmaIcon from '@assets/app/shawarma.png'
import LunchIcon from '@assets/app/lunch.png'
import ChickenIcon from '@assets/app/chicken.png'
import CakesIcon from '@assets/app/cakes.png'
import TraditionalIcon from '@assets/app/homemade.png'
import IceCreamIcon from '@assets/app/icecream.png'
import HomemadeIcon from '@assets/app/home-made.png'
import GroceriesIcon from '@assets/app/groceries.png'
import FuraIcon from '@assets/app/fura.png'
import IndianIcon from '@assets/app/indian.png'


export type CategoryTags = 'Food' | 'Ice Cream' | 'Fast food' | 'Sweet Tooth' | 'Chicken' | 'Shawarma'
export type AllCategoryTags = 'Food' | 'Ice Cream' | 'Fast food' | 'Fura' | 'Sweet Tooth' | 'Chicken' | 'Shawarma' | 'Groceries' | 'Indian' | 'Homemade'

export const MappedTags: Record<CategoryTags, ImageSourcePropType> = {
    "Sweet Tooth": CakesIcon,
    "Ice Cream": IceCreamIcon,
    'Chicken': ChickenIcon,
    'Fast food': HomemadeIcon,
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
    },
    {
        name: 'Fast food',
        icon: HomemadeIcon
    },
    {
        name:'Sweet Tooth',
        icon: CakesIcon
    }
]


export const AllTagsWithImages: Array<{name: AllCategoryTags, icon: ImageSourcePropType}> = [
    {
        name: 'Food',
        icon: LunchIcon
    },
    {
        name: 'Ice Cream',
        icon: IceCreamIcon
    },
    {
        name:'Groceries',
        icon: GroceriesIcon
    },
    {
        name:'Homemade',
        icon: HomemadeIcon
    },
    {
        name: 'Shawarma',
        icon: ShawarmaIcon
    },
    {
        name: 'Fast food',
        icon: TraditionalIcon
    },
    {
        name:'Sweet Tooth',
        icon: CakesIcon
    },
    {
        name:'Indian',
        icon: IndianIcon
    },
    {
        name:'Fura',
        icon: FuraIcon
    }
]
