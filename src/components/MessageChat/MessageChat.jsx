import React, { useState } from "react";
import { useMessageChat } from "hooks/useVideoChat";

const MessageChat = ({ userName }) => {
  const [{ messages = [] }, { onMessage }] = useMessageChat();
  const [inputMessage, setInputMessage] = useState("");

  const onHandleSubmit = (e) => {
    e.preventDefault();
    onMessage(inputMessage);
    setInputMessage("");
  };
  return (
    <div>
      <div>
        {messages.map((m) => {
          return <div key={m}>{`${userName}: ${m}`}</div>;
        })}
      </div>
      <form onSubmit={onHandleSubmit}>
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
        />
        <input type="submit" value="send" />
      </form>
    </div>
  );
};

export default MessageChat;
