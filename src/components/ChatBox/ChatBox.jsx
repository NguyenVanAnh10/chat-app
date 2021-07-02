import React, { useContext, useEffect, useRef, useState } from 'react';
import { useBreakpointValue, VStack } from '@chakra-ui/react';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';
import ChatHeader from 'components/ChatHeader';
import useRoom from 'hooks/useRoom';
import { AccountContext } from 'App';

import styles from './ChatBox.module.scss';

const ChatBox = ({ roomId }) => {
  const { account } = useContext(AccountContext);
  const [{ room, seeMessagesState }, { seeMessages }] = useRoom(roomId);
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
    if (!room.newMessageNumber || seeMessagesState.loading) return;
    seeMessages({ roomId, userId: account.id });
  };

  if (!roomId) return null;
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
      <ChatHeader roomId={roomId} />
      <MessageList
        roomId={roomId}
        ref={messagesContainerRef}
        bottomMessagesBoxRef={bottomMessagesBoxRef}
      />
      <MessageInput
        roomId={roomId}
        bottomMessagesBoxRef={bottomMessagesBoxRef}
      />
    </VStack>
  );
};
export default ChatBox;
