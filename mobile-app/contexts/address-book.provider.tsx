import {AddressBookI, AddressLabelI, ListingCategoryI, UserHomePage} from "@nanahq/sticky";
import useSWR, {Fetcher} from "swr";
import {_api} from "@api/_request";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {useLoading} from "@contexts/loading.provider";

export interface AddressProviderProps{
    addressLabels: AddressLabelI[];
    addressBook: AddressBookI[];
    hasFetchedAddresses: boolean;
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

const AddressContext = createContext<AddressProviderProps>({} as any);

export function useAddress(): AddressProviderProps {
    return useContext(AddressContext);
}

export function AddressProvider (props: PropsWithChildren<any>): any {
    const {data, isLoading} = useSWR('address-books/labels', fetcher, {refreshWhenHidden: true, refreshWhenOffline: true, revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 30000})
    const {data: addresses, isLoading:gettingAddresses} = useSWR('address-books', fetcher, {refreshWhenHidden: true, refreshWhenOffline: true, revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 30000})
    const { setLoadingState} = useLoading()

    const value: AddressProviderProps = {
        addressLabels: data,
        addressBook: addresses,
        hasFetchedAddresses: !isLoading && gettingAddresses && data && addresses,
    }



    useEffect(() => {
        if(!Array.isArray(data) || !Array.isArray(addresses)) {
            setLoadingState(true)
        } else {
            setLoadingState(false)
        }
    }, [data, addresses])

    return (
        <AddressContext.Provider value={value}>
            {props.children}
        </AddressContext.Provider>
    )
}
