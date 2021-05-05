import React, { useContext, useState } from "react";

import { SocketContext } from "contexts/SocketContext";

const Options = () => {
  const {
    me,
    callAccepted,
    callEnded,
    name,
    callUser,
    setName,
    leaveCall,
  } = useContext(SocketContext);
  const [idToCall, setIdToCall] = useState("");

  return (
    <div>
      options
      <div>
        <input
          placeholder="Name"
          value={name || ""}
          onChange={(v) => setName(v.target.value)}
        />
        <div>
          <input
            value={idToCall}
            onChange={(v) => setIdToCall(v.target.value)}
          />
          <div>{me}</div>
        </div>
        <div>
          {callAccepted && !callEnded ? (
            <button onClick={leaveCall}>Hang Up</button>
          ) : (
            <button onClick={() => callUser(idToCall)}>Call</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Options;
