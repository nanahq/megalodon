import React, {memo} from "react";
import {View, Text, Pressable} from "react-native";
import {tailwind} from "@tailwind";
import {AddressBookI} from "@nanahq/sticky";
import {MapPin, ChevronRight} from 'lucide-react-native'
const _DeliveryAddressBox: React.FC<{selectedAddress: AddressBookI | undefined,  onPress: () => void}> = (props) => {
    return (
        <View style={tailwind('mt-10')}>
            <Text style={tailwind('text-base text-slate-900 font-normal mb-2')}>Delivery Address
             <Text style={tailwind('text-xs font-normal text-slate-500')}>   *required</Text>
            </Text>
            <Pressable onPress={props.onPress} style={tailwind('border-0.5 border-slate-200 py-4 px-2')}>
                <View style={tailwind('flex flex-row items-center justify-between w-full')}>
                    <MapPin style={tailwind('text-primary-100')} size={20} />
                    <View style={tailwind('flex flex-col')}>
                        <Text style={tailwind('font-normal text-slate-900 text-sm')}>{props.selectedAddress === undefined ? 'Choose delivery address' : props.selectedAddress.labelName}</Text>
                    </View>
                    <ChevronRight  size={20} style={tailwind('text-gray-500')} />
                </View>
            </Pressable>
        </View>
    )
}

// const mapStyle = [
//     {
//         elementType: "geometry",
//         stylers: [
//             {
//                 color: "#f5f5f5"  // Light base color
//             }
//         ]
//     },
//     {
//         elementType: "labels.text.fill",
//         stylers: [
//             {
//                 color: "#404040"  // Dark gray text for contrast
//             }
//         ]
//     },
//     {
//         elementType: "labels.text.stroke",
//         stylers: [
//             {
//                 color: "#ffffff"
//             }
//         ]
//     },
//     {
//         featureType: "administrative",
//         elementType: "geometry",
//         stylers: [
//             {
//                 color: "#e0e0e0"
//             }
//         ]
//     },
//     {
//         featureType: "administrative.land_parcel",
//         stylers: [
//             {
//                 visibility: "off"
//             }
//         ]
//     },
//     {
//         featureType: "administrative.locality",
//         elementType: "labels.text.fill",
//         stylers: [
//             {
//                 color: "#404040"
//             }
//         ]
//     },
//     {
//         featureType: "poi",
//         elementType: "labels.icon",
//         stylers: [
//             {
//                 visibility: "off"
//             }
//         ]
//     },
//     {
//         featureType: "poi",
//         elementType: "labels.text.fill",
//         stylers: [
//             {
//                 color: "#757575"
//             }
//         ]
//     },
//     {
//         featureType: "poi.business",
//         stylers: [
//             {
//                 visibility: "off"
//             }
//         ]
//     },
//     {
//         featureType: "poi.park",
//         elementType: "geometry",
//         stylers: [
//             {
//                 color: "#e8f5e9"  // Light green for parks
//             }
//         ]
//     },
//     {
//         featureType: "road",
//         elementType: "geometry.fill",
//         stylers: [
//             {
//                 color: "#ffffff"  // White roads
//             }
//         ]
//     },
//     {
//         featureType: "road",
//         elementType: "labels.text.fill",
//         stylers: [
//             {
//                 color: "#666666"
//             }
//         ]
//     },
//     {
//         featureType: "road.arterial",
//         elementType: "geometry",
//         stylers: [
//             {
//                 color: "#ffffff"
//             }
//         ]
//     },
//     {
//         featureType: "road.highway",
//         elementType: "geometry",
//         stylers: [
//             {
//                 color: "#ffffff"  // White highways
//             }
//         ]
//     },
//     {
//         featureType: "road.highway",
//         elementType: "geometry.stroke",
//         stylers: [
//             {
//                 color: "#e6e6e6"  // Light gray stroke for highways
//             }
//         ]
//     },
//     {
//         featureType: "road.highway.controlled_access",
//         elementType: "geometry",
//         stylers: [
//             {
//                 color: "#ffffff"
//             }
//         ]
//     },
//     {
//         featureType: "road.local",
//         elementType: "labels.text.fill",
//         stylers: [
//             {
//                 color: "#9e9e9e"
//             }
//         ]
//     },
//     {
//         featureType: "transit",
//         stylers: [
//             {
//                 visibility: "off"  // Hide transit elements
//             }
//         ]
//     },
//     {
//         featureType: "water",
//         elementType: "geometry",
//         stylers: [
//             {
//                 color: "#e3f2fd"  // Light blue for water
//             }
//         ]
//     },
//     {
//         featureType: "water",
//         elementType: "labels.text.fill",
//         stylers: [
//             {
//                 color: "#9e9e9e"
//             }
//         ]
//     },
//     {
//         featureType: "road.arterial",
//         elementType: "geometry.fill",
//         stylers: [
//             {
//                 color: "#ffffff"  // White arterial roads
//             }
//         ]
//     }
// ];
export const DeliveryAddressBox = memo(_DeliveryAddressBox)
