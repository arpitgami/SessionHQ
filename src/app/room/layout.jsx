"use client"

import { SocketProvider } from "@/context/socket"


export default function RoomLayout({ children }) {
    return (
        <SocketProvider>
            {children};
        </SocketProvider>
    )

}