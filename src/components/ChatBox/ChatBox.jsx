import React, { useRef } from 'react';
import { VStack } from '@chakra-ui/react';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';

import ChatHeader from 'components/ChatHeader';

import styles from './ChatBox.module.scss';

const ChatBox = ({ roomId }) => {
  const messagesContainerRef = useRef();
  const bottomMessagesBoxRef = useRef();

  if (!roomId) return null;
  return (
    <VStack
      className={styles.ChatBox}
      w="100%"
      spacing="0"
    >
      <ChatHeader roomId={roomId} />
      <MessageList
        roomId={roomId}
        ref={messagesContainerRef}
        bottomMessagesBoxRef={bottomMessagesBoxRef}
      />
      <MessageInput
        pl="3"
        roomId={roomId}
        bottomMessagesBoxRef={bottomMessagesBoxRef}
      />
    </VStack>
  );
};
export default ChatBox;
