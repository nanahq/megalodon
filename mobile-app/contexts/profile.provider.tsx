import { UserI} from "@nanahq/sticky";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {_api} from "@api/_request";
import useSWR, {Fetcher} from "swr";
import {useLoading} from "@contexts/loading.provider";

export interface ProfileProviderValues {
    profile: UserI

    parsedLocation?: string
    fetched: boolean
}

const fetcher: Fetcher<any, string> = async (url) => {
    try {
        const {data}  = await _api.requestData({
            method: 'get',
            url
        })
        return data
    } catch (error) {
        console.warn(error)
        throw new Error(error)
    }
}

const ProfileContext = createContext<ProfileProviderValues>({} as any);

export function useProfile(): ProfileProviderValues {
    return useContext(ProfileContext);
}

export function ProfileProvider (props: PropsWithChildren<any>): any {
    const {data, isLoading} = useSWR('user/profile', fetcher, {refreshWhenHidden: true, refreshWhenOffline: true, revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 30000})
    const { setLoadingState} = useLoading()
    const value: ProfileProviderValues = {
        profile: data,
        fetched: data && !isLoading
    }


    useEffect(() => {
        if(!Object(data).hasOwnProperty('_id')) {
            setLoadingState(true)
        } else {
            setLoadingState(false)
        }
    }, [data])
    return (
        <ProfileContext.Provider value={value}>
            {props.children}
        </ProfileContext.Provider>
    )
}
