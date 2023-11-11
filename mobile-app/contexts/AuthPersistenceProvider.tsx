import React, {createContext, PropsWithChildren, useContext, useEffect, useState,} from "react";


interface AuthPersistenceI {
    isAuthenticated: boolean;
    token: string | null;
    setToken: (token: string) => Promise<void>;
    clearToken: () => Promise<void>;
}

const AuthPersistenceContext = createContext<AuthPersistenceI>(
    undefined as any
);


export function useAuthPersistence(): AuthPersistenceI {
    return useContext(AuthPersistenceContext);
}

interface AuthPersistenceProviderI {
    api: {
        get: () => Promise<string | null>;
        set: (token: string) => Promise<void>;
        delete: () => Promise<boolean>
    };
}

export function AuthPersistenceProvider(
    props:  PropsWithChildren<AuthPersistenceProviderI>
): JSX.Element | null {
    const { api } = props;
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [token, setToken] = useState<string | null>(null)

    useEffect(() => {
        api
            .get()
            .then((token: string | null) => {
                if (token !== null) {
                    setIsAuthenticated(true)
                    setToken(token)
                } else {
                    throw new Error()
                }

            })
            .catch(() => {
                setToken(null)
                setIsAuthenticated(false)
            })
    }, []);

    const management: AuthPersistenceI = {
        isAuthenticated,
        token,
        async setToken(token: string): Promise<void> {
            await api.set(token);
            setToken(await api.get());
            setIsAuthenticated(true)
        },
        async clearToken(): Promise<void> {
            await api.delete();
            setIsAuthenticated(false)
            setToken(null);
        },
    };

    return (
        <AuthPersistenceContext.Provider value={management}>
            {props.children}
        </AuthPersistenceContext.Provider>
    );
}
