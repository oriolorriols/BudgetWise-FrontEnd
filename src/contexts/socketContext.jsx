import React, { createContext, useState, useEffect, useContext } from "react"
import { io } from 'socket.io-client'
import { useAuth } from "../contexts/authContext"

const WebSocketContext = createContext(null);

export const WebSocketProvider = ({ children }) => {
    const [isConnected, setIsConnected] = useState(false)
    const [socket, setSocket] = useState(null)
    const [connectedUsers, setConnectedUsers] = useState([])

    const [isHRconnected, setIsHRconnected] = useState(false)

    const { userId, isHR } = useAuth()

    useEffect(() => {
        if (!userId) {
            return
        }

        const newSocket = io(import.meta.env.VITE_BACKEND)

        newSocket.on('connect', () => {
            newSocket.emit('userConnected', { userId, isHR })
            setIsConnected(true)
        });

        newSocket.on('connectedUsers', (users) => {
            setConnectedUsers(users)
            console.log(users)
        });

        newSocket.on('isHRconnected', (isHRonline) => {
            setIsHRconnected(isHRonline)
        });
        
        newSocket.on('disconnect', () => {
            setIsConnected(false)
        });

        setSocket(newSocket);

        return () => {
            newSocket.disconnect()
        };
    }, [userId]);

    return (
        <WebSocketContext.Provider value={{ socket, isConnected, connectedUsers, isHRconnected }}>
            {children}
        </WebSocketContext.Provider>
    );
};

export const useSocket = () => {
    return useContext(WebSocketContext)
};
