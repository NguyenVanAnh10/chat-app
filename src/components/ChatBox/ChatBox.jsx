import React, { useContext } from "react";
import { VStack } from "@chakra-ui/react";

import { AccountContext } from "App";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";

import styles from "./ChatBox.module.scss";
import useRoom from "hooks/useRoom";
import useMessages from "hooks/useMessages";
import ChatHeader from "components/ChatHeader";

const ChatBox = ({ roomId }) => {
  const { account } = useContext(AccountContext);
  const [, { haveSeenNewMessages }] = useMessages(roomId, account._id);
  const [{ room }] = useRoom(roomId);

  const onHandleFocusInput = () => {
    if (!room.newMessageNumber) return;
    haveSeenNewMessages({ roomId: room._id, userId: account._id });
  };
  return (
    <VStack
      className={styles.ChatBox}
      flex="1"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      {room._id && (
        <>
          <ChatHeader room={room} />
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
