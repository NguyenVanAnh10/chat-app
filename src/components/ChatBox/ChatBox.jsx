import React, { useContext, useRef } from 'react';
import { VStack } from '@chakra-ui/react';

import MessageList from 'components/MessageList';
import MessageInput from 'components/MessageInput';

import ChatHeader from 'components/ChatHeader';

import styles from './ChatBox.module.scss';
import { useModel } from 'model';
import useRoom from 'hooks/useRoom';
import { AccountContext } from 'App';

const ChatBox = ({ roomId }) => {
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);
  const [, { haveSeenNewMessages }] = useModel(
    'message',
    () => ({}),
  );

  const messagesContainerRef = useRef();
  const bottomMessagesBoxRef = useRef();
  const onHandleSeenNewMessage = () => {
    if (!room.newMessageNumber) return;
    haveSeenNewMessages({ roomId, userId: account.id });
  };

  if (!roomId) return null;
  return (
    <VStack
      className={styles.ChatBox}
      w="100%"
      spacing="0"
      onClick={onHandleSeenNewMessage}
      onMouseEnter={onHandleSeenNewMessage}
      onScroll={onHandleSeenNewMessage}
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
