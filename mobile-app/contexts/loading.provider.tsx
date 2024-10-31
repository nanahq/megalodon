import {createContext, PropsWithChildren, useContext, useState} from "react";

export interface LoaderContextProviderProps {
    isLoadingState: boolean
    setLoadingState: (a: boolean) => void
}

const LoadingContext = createContext<LoaderContextProviderProps>({} as any);

export function useLoading(): LoaderContextProviderProps {
    return useContext(LoadingContext);
}

export function LoadingProvider (props: PropsWithChildren<any>): any {
    const [loading, setLoading] = useState(false)
    return (
        <LoadingContext.Provider value={{isLoadingState: loading, setLoadingState:(action: boolean) => setLoading(action)}}>
            {props.children}
        </LoadingContext.Provider>
    )
}
