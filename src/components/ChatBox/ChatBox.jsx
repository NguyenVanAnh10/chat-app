import React, { useRef, memo, useContext } from 'react';
import { VStack } from '@chakra-ui/react';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';
import ChatHeader from 'components/ChatHeader';
import MainLayout from 'layouts/MainLayout';
import { MenuContext } from 'contexts/menuContext';
import useMessages from 'hooks/useMessages';

const ChatBox = memo(() => {
  const { menuState } = useContext(MenuContext);
  const { conversationId, friendId } = menuState[menuState.active];

  const [
    { unseenMessagesState, seeMessagesState, conversation },
    { seeMessages },
  ] = useMessages({ conversationId, friendId });
  const messagesContainerRef = useRef();
  const bottomMessagesBoxRef = useRef();

  const onHandleSeeNewMessages = () => {
    if (!unseenMessagesState.total || seeMessagesState.loading) return;
    seeMessages({ conversationId: conversationId || conversation.id });
  };

  return (
    <MainLayout>
      <VStack
        w="100%"
        h="100%"
        spacing="0"
        onClick={onHandleSeeNewMessages}
        onMouseEnter={onHandleSeeNewMessages}
        onMouseLeave={onHandleSeeNewMessages}
      >
        <ChatHeader />
        <MessageList
          ref={messagesContainerRef}
          bottomMessagesBoxRef={bottomMessagesBoxRef}
        />
        <MessageInput
          bottomMessagesBoxRef={bottomMessagesBoxRef}
        />
      </VStack>
    </MainLayout>
  );
});
export default ChatBox;
