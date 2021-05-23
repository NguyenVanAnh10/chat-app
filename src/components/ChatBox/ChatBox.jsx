import React, { useContext, useEffect as useReactEffect } from "react";
import { Text, VStack } from "@chakra-ui/react";
import { v4 as uuid } from "uuid";

import { AccountContext } from "App";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";
import { useModel } from "model";

import styles from "./ChatBox.module.scss";
import useRoom from "hooks/useRoom";

const ChatBox = ({ roomId }) => {
  const [
    { messages, loading },
    { getMessages, sendMessage, haveSeenNewMessages },
  ] = useModel("message", ({ messages, getMessages, getRoom }) => ({
    messages: (getMessages.ids || []).map((id) => messages[id]),
    loading: getMessages.loading,
  }));
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);

  useReactEffect(() => {
    room._id &&
      account._id &&
      getMessages({ roomId: room._id, userId: account._id });
  }, [room._id, account._id]);

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
  if (loading) return <Text>LOADING...</Text>;
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
          <MessageList className="show-message-box" messages={messages} />
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
