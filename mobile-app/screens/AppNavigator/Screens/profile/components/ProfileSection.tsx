import React, {PropsWithChildren} from "react";
import {Pressable, StyleProp, Text, TextStyle, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";

export function ProfileSection ({heading, children}: PropsWithChildren<{heading: string}>) {
    return (
        <View style={tailwind('flex flex-col mb-5 mt-3')}>
            <Text style={tailwind('text-xl font-bold mb-4')}>{heading}</Text>
            <View style={tailwind('flex flex-col')}>
                {children}
            </View>
        </View>
    )
}

export const ProfileSectionItem: React.FC<{onPress: () => void, label: string, moreInfo?: string}> = (props) => {
    return (
        <Pressable onPress={props.onPress} style={tailwind('py-3 border-b-0.5 border-brand-ash')}>
            <View style={tailwind('flex flex-row items-center w-full items-center justify-between')}>
                <View style={tailwind('flex flex-col')}>
                    <Text>{props.label}</Text>
                    {props.moreInfo !== undefined && (
                        <Text style={tailwind('mt-2 text-brand-gray-700')}>{props.moreInfo}</Text>
                    )}
                </View>
                <IconComponent
                    name="chevron-right"
                    iconType="Feather"
                    size={22}
                    style={tailwind('text-brand-gray-700')}
                />
            </View>
        </Pressable>
    )
}

export const AccountScreenItem: React.FC<{onPress: () => void, label: string, moreInfo?: string, defaultValue?: string, showDefaults?: boolean, labelStyle?: StyleProp<TextStyle>}> = ({moreInfo,labelStyle, onPress, showDefaults = false, label, defaultValue}) => {
    return (
        <Pressable onPress={onPress} style={tailwind('py-4 border-b-0.5 border-gray-300')}>
            <View style={tailwind('flex flex-row items-center w-full items-center justify-between')}>
                <View style={tailwind('flex flex-col')}>
                    <Text style={[tailwind(''), labelStyle]}>{label}</Text>
                    {moreInfo !== undefined && (
                        <Text style={tailwind('mt-2 text-brand-gray-700')}>{moreInfo}</Text>
                    )}
                </View>
                <View style={tailwind('flex flex-row items-center')}>
                    {defaultValue && (
                        <Text style={tailwind('')}>{defaultValue}</Text>
                    )}
                    {showDefaults && !defaultValue &&
                        (
                            <View style={tailwind('flex flex-row items-center justify-center border-0.5 border-warning-600 py-1 px-3 rounded-xl')}>
                                <Text style={tailwind('text-warning-500')}>Not complete</Text>
                            </View>
                        )
                    }
                    <IconComponent
                        name="chevron-right"
                        iconType="Feather"
                        size={32}
                        style={tailwind('text-brand-gray-700')}
                    />
                </View>
            </View>
        </Pressable>
    )
}

ProfileSection.Item = ProfileSectionItem
