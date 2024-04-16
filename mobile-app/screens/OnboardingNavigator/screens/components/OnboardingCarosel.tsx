import {Dimensions, ImageSourcePropType, Image, View, Text} from "react-native";
import { SwiperFlatList } from "react-native-swiper-flatlist";
import ImageA from "@assets/onboarding/jollof.jpg";
import ImageB from "@assets/onboarding/groceries.jpg";
import ImageC from "@assets/onboarding/icecrream.jpg";

import { getColor, tailwind } from "@tailwind";
import {CarouselPagination} from "@screens/OnboardingNavigator/screens/components/PaginationComponent";

interface CarouselImage {
    image: ImageSourcePropType;
    title: string;
    subtitle: string;
}

const slides: JSX.Element[] = [
    <ImageSlide
        image={ImageA}
        key={0}
        subtitle="DeFiChain Wallet is fully non-custodial. Only you will have access to your fund."
        title=""
    />,
    <ImageSlide
        image={ImageB}
        key={1}
        subtitle="Review your available and locked assets in your portfolio."
        title="View your assets in one place"
    />,
    <ImageSlide
        image={ImageC}
        key={2}
        subtitle="Trade on the DEX and earn rewards from liquidity mining with crypto and dTokens."
        title="Maximize earning potential"
    />,

    <ImageSlide
        image={ImageA}
        key={3}
        subtitle="Access financial opportunities with dTokens minted through decentralized vaults."
        title="Decentralized loans"
    />,
    <ImageSlide
        image={ImageA}
        key={4}
        subtitle="Seamless transfers between DeFiChain and MetaChain via generated EVM address."
        title="EVM compatible"
    />,
];

const { width } = Dimensions.get("window");

export function ImageSlide({
                               image,
                               title,
                               subtitle,
                           }: CarouselImage): JSX.Element {
    const {width, height} = Dimensions.get('window')

    return (


        <View style={tailwind("flex-1 items-center justify-center px-10")}>
            <Image

                source={image}
                style={{ width, height: height /2,  objectFit: "cover"}}
            />
            <View style={tailwind("items-center justify-center mt-3 mb-2")}>
                <Text style={tailwind("text-xl font-semibold text-center")}>
                    {title}
                </Text>
                <Text style={tailwind("font-normal text-center mt-2")}>
                    {subtitle}
                </Text>
            </View>
        </View>
    );
}

export function OnboardingCarousel(): JSX.Element {
    return (
        <SwiperFlatList
            autoplay
            autoplayDelay={10}
            autoplayLoop
            autoplayLoopKeepAnimation
            data={slides}
            index={0}
            paginationActiveColor={
                getColor("primary-500")
            }
            paginationStyleItemActive={tailwind("w-6 h-1.5")}
            paginationDefaultColor={
                getColor("gray-500")
            }
            paginationStyleItem={tailwind("h-1.5 w-1.5 mx-0.75")}
            PaginationComponent={CarouselPagination}
            renderItem={({ item }) => (
                <View style={{ width: Number(width) }}>{item}</View>
            )}
            showPagination
        />
    );
}
