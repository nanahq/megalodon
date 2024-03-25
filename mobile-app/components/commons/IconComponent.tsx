import React from 'react'

import {IconProps } from '@expo/vector-icons/build/createIconSet'
import {
    MaterialIcons,
    Feather,
    MaterialCommunityIcons,
    AntDesign,
    Foundation,
    Ionicons,
} from '@expo/vector-icons'

export type IconType = "MaterialCommunityIcons" | "MaterialIcons" | "Feather" | 'AntDesign' | "Foundation" | "Ionicons";
export type IconName =
    | React.ComponentProps<typeof MaterialIcons>["name"]
    | React.ComponentProps<typeof MaterialCommunityIcons>["name"]
    | React.ComponentProps<typeof Feather>["name"]
    | React.ComponentProps<typeof AntDesign>["name"]
    | React.ComponentProps<typeof Foundation>["name"]
    | React.ComponentProps<typeof Ionicons>["name"]

interface IconComponentProps {
    iconType: IconType;
}


type Props = IconComponentProps & IconProps<any>

export function IconComponent (props: Props): JSX.Element {
    const {
        iconType,
        style,
        ...otherProps
    } = props
    switch (iconType) {
        case 'MaterialCommunityIcons':
            return <MaterialCommunityIcons {...otherProps} style={style} />
        case 'MaterialIcons':
            return <MaterialIcons {...otherProps} style={style} />

        case 'Feather':
            return <Feather {...otherProps} style={style} />

        case 'AntDesign':
            return <AntDesign {...otherProps} style={style} />

        case 'Foundation':
            return <Foundation {...otherProps} style={style} />

        case 'Ionicons':
            return <Ionicons {...otherProps} style={style} />
        default:
         return <></>
    }
}
