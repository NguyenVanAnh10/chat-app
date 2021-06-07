import React from "react";
import { VStack } from "@chakra-ui/react";

import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";

import ChatHeader from "components/ChatHeader";

import styles from "./ChatBox.module.scss";

const ChatBox = ({ roomId, onBack }) => {
  if (!roomId) return null;
  return (
    <VStack
      className={styles.ChatBox}
      flex="1"
      w="100%"
      alignItems="flex-start"
      justifyContent="space-between"
    >
      <ChatHeader roomId={roomId} onBack={onBack} />
      <MessageList className="show-message-box" roomId={roomId} />
      <MessageInput roomId={roomId} pl="3" />
      )}
    </VStack>
  );
};
export default ChatBox;
