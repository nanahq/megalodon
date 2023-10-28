import {ScrollView, View, Text, StyleProp, ViewProps, ScrollViewProps} from 'react-native'
import {tailwind} from "@tailwind";
import {PropsWithChildren} from "react";
import {IconComponent} from "@components/commons/IconComponent";

interface  CategoryScrollableProps {
    tesID: string
    heading: string
    containerStyle?: StyleProp<ScrollViewProps>
    headingStyle?: StyleProp<ViewProps>
}

export function CategoryScrollable (props: PropsWithChildren<CategoryScrollableProps>): JSX.Element {
    return (
       <View style={tailwind('flex flex-col bg-white py-3.5 mb-4')} testID={props.tesID}>
           <View style={[ props.headingStyle, tailwind('flex flex-row w-full items-center justify-between mb-4')]}>
            <Text style={tailwind('font-bold text-lg')}>{props.heading}</Text>
               <IconComponent
                   iconType='Feather'
                   name='arrow-right-circle'
                   size={28} style={tailwind('font-light text-brand-blue-500')}
               />
           </View>
           <ScrollView
               contentContainerStyle={[tailwind('px-3.5'), props.containerStyle]}
               horizontal
               showsHorizontalScrollIndicator={false}
           >
               {props.children}
           </ScrollView>
       </View>
    )
}
