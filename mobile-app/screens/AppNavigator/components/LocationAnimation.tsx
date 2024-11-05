import { Text, View } from 'react-native'
import { tailwind } from '@tailwind'
import Lottie from 'lottie-react-native'
import Animation from '@assets/animations/lottie-location.json'
import { useEffect, useRef } from 'react'

export function LocationAnimation (): JSX.Element {
    const animationRef = useRef<any>(null)
    useEffect(() => {
        animationRef.current?.play()
    }, [])
    return (
        <View style={tailwind('flex flex-col w-full')}>
            <Lottie
                ref={animationRef}
                style={{
                    width: 400,
                    height: 400
                }}
                source={Animation}
                autoPlay
                loop
            />
            <Text style={tailwind('text-center text-slate-900 text-3xl mb-3 font-bold')}>Allow location access</Text>
            <Text style={tailwind('text-center font-normal text-slate-900 px-5')}>
                To get your food to you faster and discover restaurants nearby, please enable location sharing.
            </Text>
        </View>
    )
}
