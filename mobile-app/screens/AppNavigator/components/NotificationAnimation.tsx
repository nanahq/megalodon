import { Text, View } from 'react-native'
import { tailwind } from '@tailwind'
import Lottie from 'lottie-react-native'
import Animation from '@assets/animations/lottie-notifiction.json'
import { useEffect, useRef } from 'react'

export function NotificationAnimation (): JSX.Element {
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
            <Text style={tailwind('text-center  text-xl font-bold')}>Enable Notifications</Text>
            <Text style={tailwind('text-center text-slate-900 font-normal px-4')}>
              To receive updates on your order, new deals and promotions.
            </Text>
        </View>
    )
}
