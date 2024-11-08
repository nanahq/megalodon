import {StackScreenProps} from "@react-navigation/stack";
import {HomeParamsList} from "@screens/AppNavigator/Screens/home/HomeNavigator";
import {HomeScreenName} from "@screens/AppNavigator/Screens/home/HomeScreenNames.enum";
import {Text, TextInput, View} from "react-native";
import React, {useEffect, useMemo, useRef, useState} from "react";
import {VendorI} from "@nanahq/sticky";
import {tailwind} from "@tailwind";
import {ModalCloseIcon} from "@screens/AppNavigator/Screens/modals/components/ModalCloseIcon";
import {Search} from 'lucide-react-native'
import * as Device from "expo-device";
import Animation from "@assets/animations/lottie-no-result.json";
import Lottie from "lottie-react-native";
import {useListings} from "@contexts/listing.provider";

type SingleCategoryScreenProps = StackScreenProps<HomeParamsList, HomeScreenName.SINGLE_CATEGORY>

export const SingleCategoryScreen: React.FC<SingleCategoryScreenProps> = ({route, navigation}) => {
    const {categories} = useListings()
    const inputRef = useRef<TextInput>(null)
    const animationRef = useRef<any>(null)
    const [isFocused, setIsFocused] = useState(false)
    const [searchParam, setSearchParam] = useState(route.params.category)
    const filteredVendors = useMemo<Array<VendorI>>(() => {
        if (categories === undefined) {
            return []
        }
        return categories
            .filter(cat => cat.tags.some(c => c.toLowerCase().includes(searchParam.toLowerCase())) || cat.vendor.businessName.toLowerCase().includes(searchParam.toLowerCase()))
            .map(filtered => filtered.vendor)

    }, [categories, searchParam])


    useEffect(() => {
        navigation.setOptions({
            headerShown: true,
            headerBackTitleVisible: false,
            headerTitle: 'Search Vendor or Food',
            headerStyle:  {
                shadowOpacity: 8,
                shadowRadius: 12,
            },
            headerLeft: () => <ModalCloseIcon onPress={() => navigation.goBack()} />,
        })
    }, [])


    useEffect(() => {
        animationRef.current?.play()
    }, [])

    return (
        <View style={tailwind('flex flex-1 bg-white px-4')}>
            <View style={tailwind('mt-4')}>
                <View style={tailwind('flex flex-row items-center rounded-lg border-1.5 border-gray-200 px-2  w-full', {
                    'border-1.5 border-primary-100': isFocused
                })}>
                    <View style={tailwind('flex flex-col')}>
                       <Search style={tailwind('w-6 h-6 text-black')} />
                    </View>
                    <TextInput
                        onFocus={() => setIsFocused(true)}
                        onBlur={() => setIsFocused(false)}
                        ref={inputRef}
                        style={tailwind('flex w-full items-center px-3 py-2 bg-transparent font-medium  text-lg text-brand-black-500', {
                            'text-base': Device.osName === 'iOS'
                        })}
                        placeholderTextColor="Search vendor or meal"
                        value={searchParam}
                        onChangeText={v => setSearchParam(v)}
                    />
                </View>
            </View>
            {filteredVendors.length < 1 && (
                <View style={tailwind('mt-5 flex flex-col w-full')}>
                    <Text style={tailwind('text-3xl text-black text-center my-3')}>No results found</Text>
                    <Lottie
                        ref={animationRef}
                        style={{
                            width: 200,
                            height: 200
                        }}
                        source={Animation}
                        autoPlay
                        loop
                    />
                </View>
            )}
        </View>
    )
}
