import {View, ActivityIndicator, ActivityIndicatorProps, ViewStyle, StyleProp} from 'react-native'
import {getColor, tailwind} from "@tailwind";

interface LoaderComponentProps extends ActivityIndicatorProps {
 containerStyle?: StyleProp<ViewStyle>
 loaderColor?: string
}
export function LoaderComponent (props: LoaderComponentProps): JSX.Element {
    const {containerStyle, ...otherProps} = props
    return (
        <View style={[tailwind(''), containerStyle]}>
           <ActivityIndicator {...otherProps} color={props.loaderColor ? getColor(props.loaderColor) : getColor('primary-500')} />
        </View>
    )
}


export function LoaderComponentScreen (): JSX.Element {
    return (
        <View style={tailwind('flex-1 bg-white items-center justify-center')}>
            <LoaderComponent size='large' />
        </View>
    )
}
