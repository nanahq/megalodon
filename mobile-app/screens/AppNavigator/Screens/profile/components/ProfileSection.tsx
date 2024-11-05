import React, {PropsWithChildren} from "react";
import {Pressable, StyleProp, Text, TextStyle, View} from "react-native";
import {tailwind} from "@tailwind";
import {IconComponent} from "@components/commons/IconComponent";
import {ChevronRight} from "lucide-react-native";

export function ProfileSection ({heading, children}: PropsWithChildren<{heading: string}>) {
    return (
        <View style={tailwind('flex flex-col mb-5 mt-3')}>
            <Text style={tailwind('text-lg font-semibold text-slate-900 mb-2')}>{heading}</Text>
            <View style={tailwind('flex flex-col')}>
                {children}
            </View>
        </View>
    )
}

export const ProfileSectionItem: React.FC<{onPress: () => void, label: string, moreInfo?: string, disabled?: boolean}> = (props) => {
    return (
        <Pressable onPress={props.onPress} style={tailwind('py-3 border-b-0.5 border-slate-200')}>
            <View style={tailwind('flex flex-row items-center w-full items-center justify-between')}>
                <View style={tailwind('flex flex-col')}>
                    <Text style={tailwind('font-normal text-base text-slate-900', {'text-slate-400': props?.disabled})}>{props.label}</Text>
                    {props.moreInfo !== undefined && (
                        <Text style={tailwind('mt-2 font-normal text-xs text-slate-500')}>{props.moreInfo}</Text>
                    )}
                </View>
                {/* <ChevronRight */}
                {/*     size={22} */}
                {/*     style={tailwind('text-slate-900 font-normal')} */}
                {/* /> */}
            </View>
        </Pressable>
    )
}

export const AccountScreenItem: React.FC<{onPress: () => void, label: string, moreInfo?: string, defaultValue?: string, showDefaults?: boolean, labelStyle?: StyleProp<TextStyle>}> = ({moreInfo,labelStyle, onPress, showDefaults = false, label, defaultValue}) => {
    return (
        <Pressable onPress={onPress} style={tailwind('py-4 border-b-0.5 border-slate-200')}>
            <View style={tailwind('flex flex-col w-full')}>
                <View style={tailwind('flex flex-col')}>
                    <Text style={[tailwind('font-normal text-base text-slate-900'), labelStyle]}>{label}</Text>
                </View>
                {defaultValue && (
                    <View style={tailwind('flex flex-row items-center')}>
                        <Text style={tailwind('font-normal text-sm text-slate-600')}>{defaultValue}</Text>
                    </View>
                )}
            </View>
        </Pressable>
    )
}

ProfileSection.Item = ProfileSectionItem
