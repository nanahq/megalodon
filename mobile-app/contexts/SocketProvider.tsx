import React, {createContext, PropsWithChildren, useContext, useEffect, useState,} from "react";
import {io} from "socket.io-client";
import {NetworkMapper} from "@api/network.mapper";

export const socket = io(NetworkMapper.PRODUCTION)

interface WebSocketI {
    isConnected: boolean;
    transport: string
}

export const WebSocketContext = createContext<WebSocketI>(
    undefined as any
);


export function useWebSocket(): WebSocketI {
    return useContext(WebSocketContext);
}


export function WebSocketProvider(
    props: PropsWithChildren<any>
): JSX.Element | null {
    const [isConnected, setIsConnected] = useState(false);
    const [transport, setTransport] = useState('N/A');

    useEffect(() => {
        if (socket.connected) {
            onConnect();
        }
        function onConnect() {
            setIsConnected(true);
            setTransport(socket.io.engine.transport.name);
            socket.io.engine.on('upgrade', (transport) => {
                setTransport(transport.name);
            });
        }

        function onDisconnect() {
            setIsConnected(false);
            setTransport('N/A');
        }

        socket.on('connect', onConnect);
        socket.on('disconnect', onDisconnect);

        return () => {
            socket.off('connect', onConnect);
            socket.off('disconnect', onDisconnect);
        };
    }, []);


    const state: WebSocketI = {
        isConnected,
        transport
    };

    return (
        <WebSocketContext.Provider value={state}>
            {props.children}
        </WebSocketContext.Provider>
    );
}
