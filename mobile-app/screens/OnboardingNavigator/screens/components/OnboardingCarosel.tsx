import React from 'react'
import {Dimensions, ImageSourcePropType, Platform, Image, View, Text} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import ImageFood from "@assets/onboarding/onboarding-food.png";
import ImageGroceries from "@assets/onboarding/onboarding-groceries.png";
import ImagePackage from "@assets/onboarding/onboarding-package.png";
import { getColor, tailwind } from "@tailwind";
import {
    CarouselPagination,
    CarouselPaginationWithNextButton
} from "@screens/OnboardingNavigator/screens/components/CarouselPagination";

interface CarouselImage {
    image: ImageSourcePropType;
    title: string;
    subtitle: string;
}
export const ImageSlide: React.FC = ({image, title, subtitle,}: CarouselImage) => {
    return (
        <View style={tailwind("flex-1 items-center justify-center bg-white")}>
            <Image
                contentFit="contain"
                source={image}
                style={{ width: 306, height: 250 }}
            />
            <View style={tailwind("items-center justify-center mt-7 mb-5")}>
                <Text style={tailwind("text-xl font-bold text-center")}>
                    {title}
                </Text>
                <Text style={tailwind("text-center mt-2")}>
                    {subtitle}
                </Text>
            </View>
        </View>
    );
}




const slides: React.ReactNode[] = [
    <ImageSlide
        image={ImageFood}
        key={0}
        subtitle="Discover thousands of food menu from your favorite restaurants and homemade vendors."
        title="Food delivery to your doorstep"
    />,
    <ImageSlide
        image={ImageGroceries}
        key={1}
        title="Groceries and Essentials Delivery"
        subtitle="Shop from your familiar super markets from your phone"
    />,
    <ImageSlide
        image={ImagePackage}
        key={2}
        subtitle="Need something to get picked up? Order a delivery service"
        title="Send or receive and item/parcel"
    />
];

const { width } =
    Platform.OS === "web" ? { width: "375px" } : Dimensions.get("window");


export const OnboardingCarousel: React.FC = () => {
    return (
        <SwiperFlatList
            autoplay={false}
            data={slides}
            index={0}
            paginationActiveColor={getColor("black")}
            paginationStyleItemActive={tailwind("w-20 h-1.5")}
            paginationDefaultColor={getColor('gray-400')}
            paginationStyleItem={tailwind("h-1.5 w-20")}
            PaginationComponent={CarouselPaginationWithNextButton}
            renderItem={({ item }) => (
                <View style={[{ width: Number(width) }, tailwind('bg-white px-4')]}>{item}</View>
            )}
            showPagination
        />
    );
}
