import React from 'react'
import ReactPlayer from 'react-player'
const StreamPlayer = (props) => {

    const { stream, muted, userID, playing } = props;
    return (
        stream && <ReactPlayer url={stream} muted={muted} key={userID} playing={playing} />
    )
}

export default StreamPlayer