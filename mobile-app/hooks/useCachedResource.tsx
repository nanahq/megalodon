import {useEffect, useState} from "react";
import {Logger} from '@api/logging.util'
import * as Font from 'expo-font'
import fontLight from '@assets/fonts/nana-new-font-light.ttf'
import fontRegular from '@assets/fonts/nana-new-font-regular.ttf'
import fontSemi from '@assets/fonts/nana-new-font-semi.ttf'
import fontBold from '@assets/fonts/nana-new-font-bold.ttf'
/**
 * Delaying splash screen to load additional resources prior to rendering the app
 * @return boolean when loading complete
 */
export function useCachedResource (): boolean {
    const [isLoaded, setIsLoaded] = useState<boolean>(false)

    useEffect(() =>{
        LoadCachedResourceAsync().finally(() => {
            setIsLoaded(true)
        })
    }, [])

    return isLoaded
}

async function LoadCachedResourceAsync (): Promise<void> {
    try {
        await Font.loadAsync({
            ThinFont: fontLight,
            RegularFont: fontRegular,
            MediumFont: fontSemi,
            SemiBoldFont: fontSemi,
            BoldFont: fontBold
        })
    } catch (error) {
        Logger.error(error)
    }
}
