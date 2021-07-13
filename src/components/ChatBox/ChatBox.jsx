import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBreakpointValue, VStack } from '@chakra-ui/react';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';
import ChatHeader from 'components/ChatHeader';
import useConversation from 'hooks/useConversation';
import { AccountContext } from 'App';

import styles from './ChatBox.module.scss';

const ChatBox = ({ conversationId }) => {
  const { account } = useContext(AccountContext);
  const [{ conversation, seeMessagesState }, { seeMessages }] = useConversation(conversationId);
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const [height, setHeight] = useState(() => window.innerHeight || '100vh');

  const messagesContainerRef = useRef();
  const bottomMessagesBoxRef = useRef();
  const chatBoxRef = useRef();

  useEffect(() => {
    window.addEventListener('resize', e => {
      if (!chatBoxRef.current || !isMobileScreen) return;
      setHeight(e.target.innerHeight);
    });
  }, [isMobileScreen]);

  const onHandleSeeNewMessages = () => {
    if (!conversation.newMessageNumber || seeMessagesState.loading) return;
    seeMessages({ conversationId, userId: account.id });
  };

  if (!conversationId) return null;
  return (
    <VStack
      ref={chatBoxRef}
      className={styles.ChatBox}
      h={`${height}px`}
      w="100%"
      spacing="0"
      onClick={onHandleSeeNewMessages}
      onMouseEnter={onHandleSeeNewMessages}
      onMouseLeave={onHandleSeeNewMessages}
    >
      <ChatHeader conversationId={conversationId} />
      <MessageList
        conversationId={conversationId}
        ref={messagesContainerRef}
        bottomMessagesBoxRef={bottomMessagesBoxRef}
      />
      <MessageInput
        conversationId={conversationId}
        bottomMessagesBoxRef={bottomMessagesBoxRef}
      />
    </VStack>
  );
};
export default ChatBox;
