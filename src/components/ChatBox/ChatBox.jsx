import React, { useContext, useRef } from 'react';
import { VStack } from '@chakra-ui/react';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';
import ChatHeader from 'components/ChatHeader';
import { useModel } from 'model';
import useRoom from 'hooks/useRoom';
import { AccountContext } from 'App';

import styles from './ChatBox.module.scss';

const ChatBox = ({ roomId }) => {
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);
  const [, { seeMessages }] = useModel(
    'message',
    () => ({}),
  );

  const messagesContainerRef = useRef();
  const bottomMessagesBoxRef = useRef();
  const onHandleSeeNewMessages = () => {
    if (!room.newMessageNumber) return;
    seeMessages({ roomId, userId: account.id });
  };

  if (!roomId) return null;
  return (
    <VStack
      className={styles.ChatBox}
      w="100%"
      spacing="0"
      onClick={onHandleSeeNewMessages}
      onMouseEnter={onHandleSeeNewMessages}
      onScroll={onHandleSeeNewMessages}
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
