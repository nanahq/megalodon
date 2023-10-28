import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecurePersistence from 'expo-secure-store'


enum AUTH_KEY {
    KEY = '@AUTH_TOKEN',
    SECURE_KEY="SECURE_AUTH_KEY"
}

async function get (): Promise<string | null> {
  return  await AsyncStorage.getItem(AUTH_KEY.KEY)
}

async function set (token: string): Promise<void> {
  return await AsyncStorage.setItem(AUTH_KEY.KEY, token)
}

async function getSecure(): Promise<string | null> {
    return await SecurePersistence.getItemAsync(AUTH_KEY.SECURE_KEY)
}

async function setSecure(token: string): Promise<void> {
    return await SecurePersistence.setItemAsync(AUTH_KEY.SECURE_KEY, token)
}

async function deleteSecure (): Promise<boolean> {
    await SecurePersistence.deleteItemAsync(AUTH_KEY.SECURE_KEY)
    return true
}

export async function clear (): Promise<void> {
    return await AsyncStorage.removeItem(AUTH_KEY.KEY)
}

export const persistence = {
    set,
    get,
//    Secure store helper functions
    deleteSecure,
    setSecure,
    getSecure
}



