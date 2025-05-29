"use client"

import ChatSection from '@/component/ChatSection';
import StreamPlayer from '@/component/StreamPlayer';
import ControlPannel from '@/component/ControlPannel';
import React, { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useSocket } from '@/context/socket';
import usePeer from '@/hooks/usePeer';
import useMediaStream from '@/hooks/useMediaStream';


const page = () => {
    const { socket } = useSocket();
    const { roomid } = useParams();
    const { peer, peerid } = usePeer();
    const { stream, setStream } = useMediaStream();

    const [incomingStream, setIncomingStream] = useState(null);
    const [incomingID, setIncomingID] = useState(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isCall, setIsCall] = useState(null);
    const [isOtherUserSharingScreen, setIsOtherUserSharingScreen] = useState(false);

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

            setIsCall(call);

            call.on('stream', (incomingstream) => {
                console.log("incoming Stream from ", peerid);

                setIncomingStream(incomingstream);
                setIncomingID(peerid);

            }) // incoming stream


        })
        socket.on("user-left", (peerId) => {
            console.log("userleft");
            setIncomingStream(null);
            setIncomingID(null);
        })
        socket.on("user-sharing-screen-status", (status) => {
            console.log("screen is shared by other user", status);
            setIsOtherUserSharingScreen(status);
        })
    }, [socket, peer, stream, peerid])

    //accept the call
    useEffect(() => {
        if (!peer || !stream) return;

        peer.on('call', (call) => {
            setIsCall(call);

            const { peer: callerid } = call; // extracting calledid

            call.answer(stream); // sending my stream
            call.on('stream', (incomingstream) => {
                console.log("incoming Stream from", callerid);

                setIncomingStream(incomingstream);
                setIncomingID(callerid);

            }) // incoming stream
        })

    }, [peer, stream])


    //let other user know screen is been shared for disabling ui elements
    useEffect(() => {
        if (!socket || !roomid) return;

        if (isScreenSharing) {
            socket.emit("screen-sharing-status", roomid, true);
        }
        else {
            socket.emit("screen-sharing-status", roomid, false);
        }
    }, [isScreenSharing]);


    return (
        <div className="flex h-screen w-screen items-center justify-evenly ">
            <div className="relative flex flex-col h-screen justify-evenly ">
                <div className="flex gap-4 ">
                    {stream && <StreamPlayer stream={stream} muted={true} userID={peerid} playing={true}
                        isScreenSharing={isOtherUserSharingScreen || isScreenSharing} isLocalUser={isScreenSharing} />}
                    {incomingStream && <StreamPlayer stream={incomingStream} muted={true} userID={incomingID} playing={true}

                        isScreenSharing={isOtherUserSharingScreen || isScreenSharing} isLocalUser={!isScreenSharing} />}
                </div>
                {stream && <ControlPannel className="absolute bottom-1 left-1/2 -translate-x-1/2"
                    isScreenSharing={isScreenSharing}
                    setIsScreenSharing={setIsScreenSharing} stream={stream} setStream={setStream}
                    call={isCall}
                    isOtherUserSharingScreen={isOtherUserSharingScreen}
                />}
            </div>
            <ChatSection currentUser="arpit" roomid={roomid} />
        </div>
    )
}

export default page