import {CategoryTags, TagsWithImages} from "@constants/MappedTags";
import {Image, Text, ImageSourcePropType, View, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";

interface TagItemI {
    name: CategoryTags
    icon: ImageSourcePropType

    onPress: (name: CategoryTags) => void

    index: number
}

export const TagItem: React.FC<TagItemI> = (props) => {
    return (
        <Pressable onPress={() => props.onPress(props.name)} style={tailwind(' mr-1 mb-2 w-20 h-20')}>
            <View style={[tailwind('flex flex-col items-center justify-center w-full px-3 py-3 rounded-5'), {backgroundColor: 'rgba(230, 230, 230, 0.4)'}]}>
                <Image source={props.icon}  style={{height: 30, width: 30}} />
            </View>
            <Text style={tailwind('text-center text-sm')}>{props.name}</Text>
        </Pressable>
    )
}

export const MoreCategories: React.FC = () => {
    return (
        <Pressable onPress={() => {}} style={tailwind(' mr-1 mb-2 w-20 h-20')}>
            <View style={[tailwind('flex flex-col items-center justify-center w-full px-3 py-3 rounded-5'), {backgroundColor: 'rgba(230, 230, 230, 0.4)'}]}>
               <IconComponent iconType="Feather" name="more-horizontal" size={30} />
            </View>
            <Text style={tailwind('text-center text-sm')}>See All</Text>
        </Pressable>
    )
}

export function CategorySection() {
    const onPress = (tag: CategoryTags) => {
        return tag
    }
    return (
        <View style={tailwind('pt-6 py-4 px-4 bg-white')}>
            <View style={tailwind('flex flex-row flex-wrap')}>
                {TagsWithImages.map((tag, index) => (
                    <TagItem index={index} name={tag.name} key={index + tag.name} icon={tag.icon} onPress={onPress} />
                ))}
                <MoreCategories />
            </View>
        </View>
    )
}
