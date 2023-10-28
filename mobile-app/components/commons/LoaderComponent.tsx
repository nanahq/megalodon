import {View, ActivityIndicator, ActivityIndicatorProps, ViewStyle, StyleProp} from 'react-native'
import {tailwind} from "@tailwind";

interface LoaderComponentProps extends ActivityIndicatorProps {
 containerStyle?: StyleProp<ViewStyle>
}
export function LoaderComponent (props: LoaderComponentProps): JSX.Element {
    const {containerStyle, ...otherProps} = props
    return (
        <View style={[tailwind(''), containerStyle]}>
           <ActivityIndicator {...otherProps} />
        </View>
    )
}


export function LoaderComponentScreen (): JSX.Element {
    return (
        <View style={tailwind('flex-1 items-center justify-center')}>
            <LoaderComponent size='large' />
        </View>
    )
}