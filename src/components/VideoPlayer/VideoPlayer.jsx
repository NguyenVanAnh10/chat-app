import React, { useState } from "react";

import Options from "components/Options";
import Notifications from "components/Notifications";
import MessageChat from "components/MessageChat";
import useVideoChat from "hooks/useVideoChat";

const VideoPlayer = () => {
  const [
    { caller: call, callAccepted, callEnded, myVideo, remoteVideo, stream, me },
    { answerCall, callUser, leaveCall, setMe },
  ] = useVideoChat();

  const [toggle, setToggle] = useState(true);
  return (
    <>
      <MessageChat userName={me.name} />
      <div style={{ display: "flex", flexDirection: "column" }}>
        {callAccepted && !callEnded && (
          <div>
            <h3>{call.name || "Call Name"}</h3>
            <video
              ref={remoteVideo}
              playsInline
              autoPlay
              style={{ width: "100%", maxWidth: 500, height: 200 }}
            />
          </div>
        )}
        {stream && (
          <div>
            <h3>{me.name || "Name"}</h3>
            <video
              ref={myVideo}
              playsInline
              autoPlay
              style={{ width: "100%", maxWidth: 500, height: 200 }}
              muted
            />
          </div>
        )}
      </div>
      <button onClick={() => setToggle(!toggle)}>toggle</button>
      <Options
        call={call}
        name={me.name || ""}
        setName={(v) => setMe({ ...me, name: v })}
        me={me}
        callAccepted={callAccepted}
        callEnded={callEnded}
        leaveCall={leaveCall}
        callUser={callUser}
      />
      <Notifications
        call={call}
        callAccepted={callAccepted}
        answerCall={answerCall}
      />
    </>
  );
};
export default VideoPlayer;
