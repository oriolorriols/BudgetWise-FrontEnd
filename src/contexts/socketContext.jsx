import React, { createContext, useState, useEffect, useContext } from "react";
import { io } from 'socket.io-client'


import { useAuth } from "../contexts/authContext"

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {

    const [isConnected, setIsConnected] = useState(false);
    const [socket, setSocket] = useState(null);

    const { userId, isHR } = useAuth()

    useEffect(() => {
        if(!userId) {
            return
        }

        const newSocket = io(import.meta.env.VITE_SOCKET_URL)

        newSocket.on('connect', () => {
            setIsConnected(true);
            newSocket.emit('Se ha conectado', { userId })
        });

        newSocket.on('disconnect', () => {
            setIsConnected(false);
        });

        setSocket(newSocket)

        return () => {
            newSocket.disconnect();
        };

    }, [userId]);

    return (
        <WebSocketContext.Provider value={{ socket, isConnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(WebSocketContext);
};
