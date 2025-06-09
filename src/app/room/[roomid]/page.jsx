"use client"

import ChatSection from '@/component/room/ChatSection';
import StreamPlayer from '@/component/room/StreamPlayer';
import ControlPannel from '@/component/room/ControlPannel';
import EndCallButton from '@/component/room/LeaveMeeting';
import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useSocket } from '@/context/socket';
import usePeer from '@/hooks/usePeer';
import useMediaStream from '@/hooks/useMediaStream';
import { useUser } from '@clerk/nextjs';


const page = () => {
    const { socket } = useSocket();
    const { roomid } = useParams();
    const { peer, peerid } = usePeer();
    const { stream, setStream } = useMediaStream();
    const { user, isLoaded } = useUser();
    const router = useRouter();

    const [incomingStream, setIncomingStream] = useState(null);
    const [incomingID, setIncomingID] = useState(null);
    const [isScreenSharing, setIsScreenSharing] = useState(false);
    const [isCall, setIsCall] = useState(null);
    const [isOtherUserSharingScreen, setIsOtherUserSharingScreen] = useState(false);
    const [name, setName] = useState(null); //username 
    const [sessionData, setSessionData] = useState(null);//meeting data
    const [isChecking, setIsChecking] = useState(true);//checking user
    const [remainingTime, setRemainingTime] = useState(null);//for timer


    async function endMeeting() {
        const res = await fetch("/api/meeting/endmeeting", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ meetingID: roomid }),
        });

        const result = await res.json();
        if (!result.success) {
            console.error(result.error);
            return;
        }

        alert("Meeting ended...");

        router.push("/feedback");
    }

    //check if user is allowed in the room
    useEffect(() => {
        if (!roomid) return;
        (async function checkuser() {
            try {
                const res = await fetch(`/api/meeting/allowuser?id=${roomid}`);
                const data = await res.json();

                console.log("meeting from room page:", data);
                if (!data.status) {
                    alert(data.message);
                    router.push("/");
                }
                setSessionData(data.meetingData);
                setIsChecking(false);
            } catch (error) {
                console.log("error in checking meeting:", error);
                alert(error);
                router.push("/");
            }
        })()
    }, [roomid])

    //timer
    useEffect(() => {
        if (isChecking || !sessionData) return;
        const slot = sessionData.slot;
        if (!slot) return;

        const interval = setInterval(() => {
            const now = new Date();
            const endTime = new Date(new Date(slot).getTime() + 60 * 60 * 1000); // slot + 1hr
            const diff = endTime.getTime() - now.getTime();

            if (diff <= 0) {
                setRemainingTime("00:00:00");
                clearInterval(interval);
                endMeeting();
                return;
            }

            const hours = String(Math.floor(diff / (1000 * 60 * 60))).padStart(2, "0");
            const minutes = String(Math.floor((diff / (1000 * 60)) % 60)).padStart(2, "0");
            const seconds = String(Math.floor((diff / 1000) % 60)).padStart(2, "0");

            setRemainingTime(`${hours}:${minutes}:${seconds}`);
        }, 1000);


        return () => {
            clearInterval(interval);
        }
    }, [isChecking, sessionData]);


    useEffect(() => {
        if (!socket || !roomid || !peerid || isChecking) return;
        socket.emit("join-room", roomid, peerid);

    }, [isChecking, socket, roomid, peerid])

    //username
    useEffect(() => {
        if (!user || !isLoaded || isChecking) return;


        if (user.firstName) return setName(user.firstName);

        if (user.fullName) {
            const first = user.fullName.trim().split(' ')[0];
            return setName(user.first)
        }

        const email = user.emailAddresses?.[0]?.emailAddress;
        if (email) return setName(email.split('@')[0]);

        setName('User'); // fallback in worst case
    }, [user, isLoaded, isChecking])

    //listeners
    useEffect(() => {
        if (!socket || !peer || !stream || !peerid || isChecking) return;

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
        socket.on("meeting-ended", () => {
            setTimeout(() => {
                alert("Other user ended the meeting...")
                router.push('/feedback');
            }, 1000)
        })
    }, [socket, peer, stream, peerid, isChecking])

    //accept the call
    useEffect(() => {
        if (!peer || !stream || isChecking) return;

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

    }, [peer, stream, isChecking])


    //let other user know screen is been shared for disabling ui elements
    useEffect(() => {
        if (!socket || !roomid || isChecking) return;

        if (isScreenSharing) {
            socket.emit("screen-sharing-status", roomid, true);
        }
        else {
            socket.emit("screen-sharing-status", roomid, false);
        }
    }, [isScreenSharing, isChecking]);



    // if (isChecking) return

    return (
        isChecking ? <div className="flex items-center justify-center h-screen w-screen text-md">Authorizing User....</div> :


            <div className="flex h-screen w-screen items-center justify-evenly ">
                {remainingTime && (
                    <div className="absolute top-2 left-10 -translate-x-1/2 bg-base-100 text-red-600 px-2 py-1 rounded-full text-sm shadow-sm z-50">
                        {remainingTime}
                    </div>
                )}

                <div className="relative flex flex-col h-screen items-center justify-evenly ">
                    <div className="flex gap-4 ">
                        {stream && <StreamPlayer stream={stream} muted={true} userID={peerid} playing={true}
                            isScreenSharing={isOtherUserSharingScreen || isScreenSharing} isLocalUser={isScreenSharing} />}
                        {incomingStream && <StreamPlayer stream={incomingStream} muted={true} userID={incomingID} playing={true}

                            isScreenSharing={isOtherUserSharingScreen || isScreenSharing} isLocalUser={!isScreenSharing} />}
                    </div>
                    <div className='flex flex-row items-center '>
                        {stream && <ControlPannel className="absolute bottom-1 left-1/2 -translate-x-1/2"
                            isScreenSharing={isScreenSharing}
                            setIsScreenSharing={setIsScreenSharing} stream={stream} setStream={setStream}
                            call={isCall}
                            isOtherUserSharingScreen={isOtherUserSharingScreen}
                        />}
                        {sessionData && sessionData._id && <EndCallButton meetingID={sessionData._id} roomid={roomid} />}
                    </div>
                </div>
                {name && <ChatSection currentUser={name} roomid={roomid} />}


            </div>
    )
}

export default page