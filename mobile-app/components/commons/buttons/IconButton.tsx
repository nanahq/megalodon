import {Pressable, PressableProps, StyleProp, Text, TextStyle} from "react-native";
import {IconComponent, IconName, IconType} from "@components/commons/IconComponent";
import {tailwind} from "@tailwind";


interface IconButtonProps extends PressableProps  {
    iconName: IconName
    iconType: IconType
    iconSize: number
    iconLabel?: string
    disabled?: boolean
    textStyle?: StyleProp<TextStyle>
    iconStyle?: StyleProp<any>
    style?:StyleProp<any>
}


export function IconButton (props: IconButtonProps): JSX.Element {
    const {disabled = false} = props
    return (
        <Pressable
            testID={props.testID}
            disabled={disabled}
            onPress={props.onPress}
            style={[tailwind('flex flex-col p-1'), props.style ]}
        >
            {props.iconName !== undefined && props.iconType !== undefined && (
                <IconComponent
                    iconType={props.iconType}
                    size={props.iconSize}
                    name={props.iconName}
                    style={props.iconStyle}
                />
            )}

            {props.iconLabel !== undefined && (
                <Text style={props.textStyle}>
                    {props.iconLabel}
                </Text>
            )}
        </Pressable>
    )
}
