import { OrderI} from "@nanahq/sticky";
import useSWR, {Fetcher} from "swr";
import {_api} from "@api/_request";
import {createContext, PropsWithChildren, useContext, useEffect, useState} from "react";
import {useLoading} from "@contexts/loading.provider";

export interface OrdersProviderProps{
    orders: OrderI[] | undefined

    hasFetchedOrders: boolean;
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

const OrdersContext = createContext<OrdersProviderProps>({} as any);

export function useOrders(): OrdersProviderProps {
    return useContext(OrdersContext);
}

export function OrdersProvider (props: PropsWithChildren<any>): any {
    const {data, isLoading, isValidating} = useSWR<OrderI[]>('order/orders', fetcher, {refreshWhenHidden: true, refreshWhenOffline: true, revalidateOnMount: true, revalidateOnFocus: true, refreshInterval: 30000})
    const { setLoadingState} = useLoading()

    const value: OrdersProviderProps = {
        orders: data,
        hasFetchedOrders: data && !isLoading
    }



    useEffect(() => {
        if(isLoading) {
            setLoadingState(true)
        } else {
            setLoadingState(false)
        }
    }, [data])

    return (
        <OrdersContext.Provider value={value}>
            {props.children}
        </OrdersContext.Provider>
    )
}
