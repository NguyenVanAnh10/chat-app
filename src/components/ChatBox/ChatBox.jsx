import React, { useContext } from "react";
import { VStack } from "@chakra-ui/react";

import { AccountContext } from "App";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";

import styles from "./ChatBox.module.scss";
import useRoom from "hooks/useRoom";
import useMessages from "hooks/useMessages";
import ChatHeader from "components/ChatHeader";

const ChatBox = ({ roomId, onBack }) => {
  const { account } = useContext(AccountContext);
  const [, { haveSeenNewMessages }] = useMessages(roomId, account._id);
  const [{ room }] = useRoom(roomId);

  const onHandleFocusInput = () => {
    if (!room.newMessageNumber) return;
    haveSeenNewMessages({ roomId: room._id, userId: account._id });
  };
  if (!roomId) return null;
  return (
    <VStack
      className={styles.ChatBox}
      flex="1"
      w="100%"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      {room._id && (
        <>
          <ChatHeader room={room} onBack={onBack}/>
          <MessageList
            className="show-message-box"
            roomId={room._id}
            userId={account._id}
          />
          <MessageInput
            roomId={roomId}
            onFocusInput={onHandleFocusInput}
            pl="3"
          />
        </>
      )}
    </VStack>
  );
};
export default ChatBox;
