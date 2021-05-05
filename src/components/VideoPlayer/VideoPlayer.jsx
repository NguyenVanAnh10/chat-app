import React, { useContext, useState } from "react";

import { SocketContext } from "contexts/SocketContext";

const VideoPlayer = () => {
  const {
    call,
    callAccepted,
    callEnded,
    myVideo,
    userVideo,
    stream,
    name,
  } = useContext(SocketContext);
  const [toggle, setToggle] = useState(true);
  return (
    <>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {callAccepted && !callEnded && (
          <div>
            <h3>{call.name || "Call Name"}</h3>
            <video
              ref={userVideo}
              playsInline
              autoPlay
              style={{ width: "100%", maxWidth: 500 }}
            />
          </div>
        )}
        {stream && (
          <div>
            <h3>{name || "Name"}</h3>
            <video
              ref={myVideo}
              playsInline
              autoPlay
              style={{ width: "100%", maxWidth: 500 }}
              muted
            />
          </div>
        )}
      </div>
      <button onClick={() => setToggle(!toggle)}>toggle</button>
    </>
  );
};
export default VideoPlayer;
