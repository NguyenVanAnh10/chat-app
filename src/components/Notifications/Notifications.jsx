import React from "react";

const Notifications = ({ call, callAccepted, answerCall }) => {
  return (
    <div>
      {call.isReceivedCall && !callAccepted && (
        <div>
          <h2>{call.name} is calling,</h2>
          <button onClick={answerCall}>Anwser</button>
        </div>
      )}
    </div>
  );
};

export default Notifications;
