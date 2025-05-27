import React, { useEffect, useRef, useState } from 'react'

const useMediaStream = () => {

    const [stream, setStream] = useState(null);
    const setMyStream = useRef(false);

    useEffect(() => {
        if (setMyStream.current) return;
        setMyStream.current = true;
        (async function initStream() {
            try {
                const mystream = await navigator.mediaDevices.getUserMedia({
                    audio: true, video: true
                })
                console.log("setting mystream...");
                setStream(mystream);

            } catch (error) {
                console.log("error while getting stream.", error);
            }
        })()

    }, [])

    return { stream };
}

export default useMediaStream;