import React, {createContext, PropsWithChildren, useContext, useEffect, useState,} from "react";
import {io, Socket} from "socket.io-client";
import {useAuthPersistence} from "@contexts/AuthPersistenceProvider";


interface WebSocketI {
    isConnected: boolean;
    socketClient: Socket | null;
}

export const WebSocketContext = createContext<WebSocketI>(
    undefined as any
);


export function useWebSocket(): WebSocketI {
    return useContext(WebSocketContext);
}


export function WebSocketProvider(
    props: PropsWithChildren<{socketEndpoint: string}>
): JSX.Element | null {
    const [socketClient, setSocketClient] = useState<Socket | null>(null)
    const [isConnected, setSocketIsConnected] = useState<boolean>(false)
    const  {isAuthenticated} = useAuthPersistence()
    useEffect(() => {

        if (!isAuthenticated) {
            return
        }
        let _socket: Socket;

        if (socketClient === null) {
            _socket = io(props.socketEndpoint, {
                transports: ['websocket'],
            });
            setSocketClient(_socket);
            setSocketIsConnected(true)
        }

        return () => {
            if (_socket) {
                _socket.disconnect();
                setSocketIsConnected(false)
            }
        };
    }, [props.socketEndpoint, isAuthenticated]);




    const state: WebSocketI = {
        isConnected,
        socketClient
    };

    return (
        <WebSocketContext.Provider value={state}>
            {props.children}
        </WebSocketContext.Provider>
    );
}
