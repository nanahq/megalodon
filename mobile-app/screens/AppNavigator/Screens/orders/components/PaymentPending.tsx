import { Text, View} from 'react-native'
import { tailwind } from '@tailwind'
import Lottie from 'lottie-react-native'
import Animation from '@assets/animations/lottie-payment-pending-2.json'
import { useEffect, useRef } from 'react'

export function PaymentPendingAnimation (): JSX.Element {
    const animationRef = useRef<any>(null)

    useEffect(() => {
        animationRef.current?.play()
    }, [])

    return (
        <View style={[tailwind('flex flex-1'), {
        }]}>
            <Lottie
                ref={animationRef}
                style={{
                    width: 100,
                    height: 100,
                }}

                source={Animation}
                autoPlay
                loop={false}
            />
            <Text style={tailwind('text-center text-brand-gray-800 text-2xl font-bold')}>
                Payment is pending
            </Text>
        </View>
    )
}
