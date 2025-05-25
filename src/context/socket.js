"use client"


import { useState, useContext, useEffect, createContext } from "react";
import { io } from "socket.io-client";


const SocketContext = createContext(null);

export function useSocket() {
    const socket = useContext(SocketContext);
    return socket;
}

export const SocketProvider = ({ children }) => {

    const [socket, setSocket] = useState(null);
    const [messages, setMessages] = useState([]);

    useEffect(() => {

        const socketInstance = io();
        setSocket(socketInstance);

        socketInstance.on("message-received", ({ user, message }) => {

            setMessages((prev) => {
                return [...prev, { user: user, message: message }];
            })
        })

        return () => {
            socketInstance.disconnect(); // clean up
        };

    }, [])

    return (
        <SocketContext.Provider value={
            {
                socket,
                messages
            }
        }>
            {children}
        </SocketContext.Provider>
    )



}