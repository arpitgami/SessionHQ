"use client";

import { useState } from "react";
import { FaMicrophone, FaMicrophoneSlash, FaVideo, FaVideoSlash } from "react-icons/fa";
import { MdScreenShare, MdStopScreenShare } from "react-icons/md";


export default function ControlPannel({ stream, setStream, setIsScreenSharing, isScreenSharing, call, isOtherUserSharingScreen }) {
    const [micOn, setMicOn] = useState(true);
    const [videoOn, setVideoOn] = useState(true);


    const toggleMic = () => {
        const audioTrack = stream?.getAudioTracks()?.[0];
        if (audioTrack) {
            audioTrack.enabled = !audioTrack.enabled;
            setMicOn(audioTrack.enabled);
        }
    };

    const toggleVideo = () => {
        const videoTrack = stream?.getVideoTracks()?.[0];
        if (videoTrack) {
            videoTrack.enabled = !videoTrack.enabled;
            setVideoOn(videoTrack.enabled);
        }
    };
    async function backToWebCamStream() {

        const originalVideoStream = await navigator.mediaDevices.getUserMedia({
            audio: true, video: true
        });
        const originalVideoTrack = originalVideoStream.getVideoTracks()[0];
        const originalAudioTrack = originalVideoStream.getAudioTracks()[0];

        // Stop the screen share track
        stream.getVideoTracks()[0]?.stop();

        // Replace track in peer connection
        replaceCallTrack(originalVideoTrack);

        // Replace track in local stream
        stream.removeTrack(stream.getVideoTracks()[0]);
        stream.addTrack(originalVideoTrack);

        // Ensure audio is also correct (optional, based on use-case)
        if (stream.getAudioTracks().length === 0 && originalAudioTrack) {
            stream.addTrack(originalAudioTrack);
        }

        setStream(stream);
        setIsScreenSharing(false);
    }

    function replaceCallTrack(screenTrack) {
        console.log("Call... : ", call);
        if (call) {
            const sender = call.peerConnection.getSenders().find(s => s.track.kind === 'video');
            if (sender) {
                sender.replaceTrack(screenTrack);
            }
        }
    }

    const toggleScreenShare = async () => {
        try {
            if (!isScreenSharing) {
                const screenStream = await navigator.mediaDevices.getDisplayMedia({ video: true });
                const screenTrack = screenStream.getVideoTracks()[0];

                console.log("screen sharing track..", screenTrack);

                const sender = stream?.getVideoTracks()?.[0];
                if (stream) {
                    stream.removeTrack(sender);
                    stream.addTrack(screenTrack);
                }

                // Replacing video track in my stream
                setStream(stream);
                setIsScreenSharing(true);

                // Replacing track in ongoing PeerJS call
                replaceCallTrack(screenTrack);


                // When user stops screen share manually
                screenTrack.onended = async () => {
                    backToWebCamStream();
                };
            } else {
                backToWebCamStream();
            }
        } catch (err) {
            console.log("Screen sharing failed", err);
        }
    };

    return (
        <div className="flex justify-center gap-4 p-4 rounded-xl bg-base-200 shadow-sm self-center ">
            <button className={`btn bg-base-100 btn-circle ${!micOn ? "bg-red-500" : ""} `} onClick={toggleMic}>
                {micOn ? (
                    <FaMicrophone />
                ) : (
                    <FaMicrophoneSlash className={`${!micOn ? "text-base-100" : ""}`} />
                )}
            </button>

            <button className={`btn bg-base-100 btn-circle ${!videoOn ? "bg-red-500" : ""}  ${isScreenSharing ? "btn-disabled" : ""} `} onClick={toggleVideo}>
                {videoOn ? (
                    <FaVideo />
                ) : (
                    <FaVideoSlash className={`${!videoOn ? "text-base-100" : ""} `} />
                )}
            </button>

            <button className={`btn bg-base-100 btn-circle ${isScreenSharing ? "bg-red-500" : ""} ${isOtherUserSharingScreen ? "btn-disabled" : ""} `} onClick={toggleScreenShare}>
                {isScreenSharing ? <MdStopScreenShare className={`${isScreenSharing ? "text-base-100" : ""} `} /> : <MdScreenShare />}
            </button>
        </div>
    );
}
