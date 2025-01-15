import React from 'react';
import {View, Image, Dimensions, Text} from 'react-native';
import { SwiperFlatList } from 'react-native-swiper-flatlist';
import AdImage2 from '@assets/ads/30% Off.jpg'
import AdImage1 from '@assets/ads/Free deliveries Banner.jpg'
import AdImage3 from '@assets/ads/Nana Box.jpg'
import AdImage4 from '@assets/ads/New year.jpg'
import {tailwind} from '@tailwind'
const { width: SCREEN_WIDTH } = Dimensions.get('window');

const GAP_SIZE = 6;
const TOTAL_GAPS = GAP_SIZE * 2;
const ITEM_WIDTH = (SCREEN_WIDTH - TOTAL_GAPS) / 3;
const ITEM_HEIGHT = (ITEM_WIDTH * 1920) / 1080;

export const AdBannerCarousel = ({ ads }) => {
    const adsData = ads || [
        { id: '1', source: AdImage1 },
        { id: '2', source: AdImage2 },
        { id: '3', source: AdImage3 },
        { id: '4', source: AdImage4 },
    ];

    const renderItem = ({ item }) => (
        <View
            style={tailwind("items-center justify-center rounded-xl")}
            >
            <Image
                source={item.source}
                style={[tailwind("rounded-lg overflow-hidden"), {
                    width: ITEM_WIDTH ,
                    height: ITEM_HEIGHT,
                }]}
                resizeMode="cover"
            />
        </View>
    );

    return (
            <View style={tailwind("flex flex-col mt-5")}>
                <Text style={tailwind('font-bold text-lg mb-5')}>Top offers</Text>
                <SwiperFlatList
                    data={adsData}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id}
                    showPagination={false}
                    autoplay={false}
                    index={0}
                    bounces={false}
                    vertical={false}
                    snapToInterval={ITEM_WIDTH + GAP_SIZE}
                    snapToAlignment="start"
                    contentContainerStyle={{
                        paddingHorizontal: 0,
                    }}
                    ItemSeparatorComponent={() => (
                        <View style={{ width: GAP_SIZE }} />
                    )}
                />
            </View>
    );
};
