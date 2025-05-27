import React, { useEffect, useRef, useState } from 'react'

const usePeer = () => {

    const [peer, setPeer] = useState(null);
    const [peerid, setPeerID] = useState('');

    const isPeer = useRef(false);

    useEffect(() => {
        if (isPeer.current) return;

        isPeer.current = true;

        (async function newPeer() {
            const myPeer = new (await import('peerjs')).default();

            setPeer(myPeer);
            myPeer.on('open', (id) => {
                console.log(`peer created, your peerid is ${id}`);
                setPeerID(id);
            })

        })();


    }, []);

    return { peer, peerid };


}

export default usePeer;

