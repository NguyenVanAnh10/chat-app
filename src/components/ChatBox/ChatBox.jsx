import React, { useContext } from "react";
import { VStack } from "@chakra-ui/react";

import { AccountContext } from "App";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";

import styles from "./ChatBox.module.scss";
import useRoom from "hooks/useRoom";
import useMessages from "hooks/useMessages";

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
      pl="3"
      justifyContent="space-between"
    >
      {room._id && (
        <>
          <MessageList
            className="show-message-box"
            roomId={room._id}
            userId={account._id}
          />
          <MessageInput roomId={roomId} onFocusInput={onHandleFocusInput} />
        </>
      )}
    </VStack>
  );
};
export default ChatBox;
