import React, { useContext } from "react";
import { VStack } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";

import { AccountContext } from "App";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";

import styles from "./ChatBox.module.scss";
import useRoom from "hooks/useRoom";
import useMessages from "hooks/useMessages";

const ChatBox = ({ roomId }) => {
  const { account } = useContext(AccountContext);
  const [, { sendMessage, haveSeenNewMessages }] = useMessages(
    roomId,
    account._id
  );
  const [{ room }] = useRoom(roomId);

  const onSendMessage = (contentMessage) => {
    sendMessage({
      keyMsg: uuid(),
      roomId: room._id,
      senderId: account._id,
      hadSeenMessageUsers: [account._id],
      content: contentMessage,
      createAt: Date.now(),
      status: false,
    });
  };
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
          <MessageInput
            onSendMessage={onSendMessage}
            onFocusInput={onHandleFocusInput}
          />
        </>
      )}
    </VStack>
  );
};
export default ChatBox;
