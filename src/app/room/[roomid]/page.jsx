"use client"

import ChatSection from '@/component/ChatSection';
import StreamPlayer from '@/component/StreamPlayer';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSocket } from '@/context/socket';
import usePeer from '@/hooks/usePeer';
import useMediaStream from '@/hooks/useMediaStream';


const page = () => {
    const { socket } = useSocket();
    const { roomid } = useParams();
    const { peer, peerid } = usePeer();
    const { stream } = useMediaStream();

    const [incomingStream, setIncomingStream] = useState(null);
    const [incomingID, setIncomingID] = useState(null);

    useEffect(() => {
        if (!socket || !roomid || !peerid) return;

        socket.emit("join-room", roomid, peerid);

    }, [socket, roomid, peerid])

    useEffect(() => {
        if (!socket || !peer || !stream || !peerid) return;

        // User is in the room another user joins, I will initiate the call.
        socket.on("new-user-joined", (peerid) => {
            console.log(`user joined the room , peerid is ${peerid}`);

            console.log("stream before calling", stream);
            const call = peer.call(peerid, stream)

            call.on('stream', (incomingstream) => {
                console.log("incoming Stream from ", peerid);

                setIncomingStream(incomingstream);
                setIncomingID(peerid);

            }) // incoming stream


        })
        socket.on("user-left", (peerId) => {
            setIncomingStream(null);
            setIncomingID(null);
        })
    }, [socket, peer, stream, peerid])

    useEffect(() => {
        //accept the call
        if (!peer || !stream) return;

        peer.on('call', (call) => {

            const { peer: callerid } = call; // extracting calledid

            call.answer(stream); // sending my stream
            call.on('stream', (incomingstream) => {
                console.log("incoming Stream from", callerid);

                setIncomingStream(incomingstream);
                setIncomingID(callerid);

            }) // incoming stream
        })

    }, [peer, stream])


    return (
        <div className="flex h-screen items-center justify-evenly ">
            <StreamPlayer className="h-max" stream={stream} muted={true} userID={peerid} playing={true} />
            {incomingStream && <StreamPlayer stream={incomingStream} muted={true} userID={incomingID} playing={true} />}
            <ChatSection currentUser="arpit" roomid={roomid} />
        </div>
    )
}

export default page