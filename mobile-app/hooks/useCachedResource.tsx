import {useEffect, useState} from "react";
import {Logger} from '@api/logging.util'
import * as Font from 'expo-font'
import { MaterialCommunityIcons} from '@expo/vector-icons'
import NanaOmnesBold from '@assets/fonts/nana-font-bold.otf'
import NanaOmnesRegular from '@assets/fonts/nana-font.otf'
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
            ...MaterialCommunityIcons.font,
            ThinFont: NanaOmnesRegular,
            LightFont: NanaOmnesRegular,
            RegularFont: NanaOmnesRegular,
            MediumFont: NanaOmnesRegular,
            SemiBoldFont: NanaOmnesBold,
            BoldFont: NanaOmnesBold
        })
    } catch (error) {
        Logger.error(error)
    }
}
