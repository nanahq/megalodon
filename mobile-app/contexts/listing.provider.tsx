import {ListingCategoryI, UserHomePage} from "@nanahq/sticky";
import useSWR, {Fetcher} from "swr";
import {_api} from "@api/_request";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {useLoading} from "@contexts/loading.provider";

export interface ListingsProviderProps{
    listings: UserHomePage | undefined

    categories: ListingCategoryI[] | undefined
    hasFetchedListings: boolean;
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

const ListingsContext = createContext<ListingsProviderProps>({} as any);

export function useListings(): ListingsProviderProps {
    return useContext(ListingsContext);
}

export function ListingsProvider (props: PropsWithChildren<any>): any {
    const {data, isLoading} = useSWR('listing/homepage?lat=0&lng=0', fetcher, {refreshWhenHidden: true, refreshWhenOffline: true, revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 30000})
    const {data: categories, isLoading: categoriesLoading} = useSWR('user/profile', fetcher, {refreshWhenHidden: true, refreshWhenOffline: true, revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 30000})
    const { setLoadingState} = useLoading()

    const value: ListingsProviderProps = {
        listings: data ?? [],
        categories: categories,
        hasFetchedListings: data && !isLoading && categories && !categoriesLoading
    }



    useEffect(() => {
        if(isLoading) {
            setLoadingState(true)
        } else {
            setLoadingState(false)
        }
    }, [data])

    return (
        <ListingsContext.Provider value={value}>
            {props.children}
        </ListingsContext.Provider>
    )
}
