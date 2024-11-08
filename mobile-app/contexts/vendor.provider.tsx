import {UserI, VendorI} from "@nanahq/sticky";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {_api} from "@api/_request";
import useSWR, {Fetcher} from "swr";
import {useLoading} from "@contexts/loading.provider";
export interface VendorProviderValues {
    vendors: VendorI[]
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

const VendorContext = createContext<VendorProviderValues>({} as any);

export function useVendor(): VendorProviderValues {
    return useContext(VendorContext);
}

export function VendorProvider (props: PropsWithChildren<any>): any {
    const {data} = useSWR('vendor/vendors', fetcher, {refreshWhenHidden: true, refreshWhenOffline: true, revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 30000})
    const { setLoadingState} = useLoading()
    const value: VendorProviderValues = {
        vendors: data,
    }

    useEffect(() => {
        if(!Array.isArray(data)) {
            setLoadingState(true)
        } else {
            setLoadingState(false)
        }
    }, [data])
    return (
        <VendorContext.Provider value={value}>
            {props.children}
        </VendorContext.Provider>
    )
}
