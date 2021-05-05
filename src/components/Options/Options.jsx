import React, { useState } from "react";

const Options = ({
  call,
  name,
  setName,
  me,
  callAccepted,
  callEnded,
  leaveCall,
  callUser,
}) => {
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
          <div>{me.id}</div>
        </div>
        <div>
          {callAccepted && !callEnded ? (
            <button onClick={leaveCall}>Hang Up</button>
          ) : (
            <button onClick={() => callUser(idToCall, call.name)}>Call</button>
          )}
        </div>
      </div>
    </div>
  );
};
export default Options;
