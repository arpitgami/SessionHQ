import React from 'react'
import ReactPlayer from 'react-player'
const StreamPlayer = (props) => {

    const { stream, muted, userID, playing, isLocalUser, isScreenSharing } = props;


    const containerStyles = isScreenSharing
        ? !isLocalUser
            ? 'w-[200px] h-[120px] my-8' // smaller size for your own video during screen share
            : 'w-full'    // larger size for screen-shared stream
        : 'w-[500px] ';   // default equal sizes when no screen sharing

    if (!stream || !userID) return null;

    return (
        <div className={`${containerStyles} transition-all duration-300 rounded overflow-hidden`}>
            {stream && userID && <ReactPlayer
                url={stream}
                muted={muted}
                playing={playing}
                key={userID}
                width="100%"
                height="100%"
            />}
        </div>
    )
}

export default StreamPlayer