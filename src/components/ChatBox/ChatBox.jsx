import React, { useRef } from 'react';
import { VStack } from '@chakra-ui/react';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';

import ChatHeader from 'components/ChatHeader';

import styles from './ChatBox.module.scss';

const ChatBox = ({ roomId }) => {
  const messagesContainerRef = useRef();
  if (!roomId) return null;
  return (
    <VStack
      className={styles.ChatBox}
      w="100%"
      spacing="0"
    >
      <ChatHeader roomId={roomId} />
      <MessageList ref={messagesContainerRef} roomId={roomId} />
      <MessageInput messagesContainerRef={messagesContainerRef} roomId={roomId} pl="3" />
    </VStack>
  );
};
export default ChatBox;
