"use client"
import ChatSection from '@/ui/ChatSection';
import React, { useEffect } from 'react'
import { useParams } from 'next/navigation'
import { useSocket } from '@/context/socket';

const page = () => {
    const { socket } = useSocket();

    const { roomid } = useParams();

    useEffect(() => {
        // console.log("socket at room page" ,socket );
        if (!socket || !roomid) return;

        socket.emit("join-room", roomid);

    }, [socket])


    return (
        <div>
            <ChatSection currentUser="arpit" roomid={roomid} />
        </div>
    )
}

export default page