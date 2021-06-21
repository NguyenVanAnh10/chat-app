import React, { useContext, useState, forwardRef } from 'react';
import {
  HStack,
  IconButton,
  Stack,
  useDisclosure,
} from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';

import useRoom from 'hooks/useRoom';
import { AccountContext } from 'App';
import useMessages from 'hooks/useMessages';
import MessageListCard from 'components/MessageListCard';
import ReviewImageModal from 'components/ReviewImageModal';
import MessageContent from 'components/MessageContent';
import Message from 'entities/Message';
import Avatar from 'components/Avatar';

import styles from './MessageList.module.scss';

const MessageList = forwardRef(({ roomId, bottomMessagesBoxRef }, ref) => {
  const [
    { messages, aggregateMessages, getMessagesState, total },
    { loadMoreMessages },
  ] = useMessages(roomId, { fetchData: true });

  const [{ room }] = useRoom(roomId);
  const { account } = useContext(AccountContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imgSrc, setImgSrc] = useState();

  const handleLoadmore = () => {
    loadMoreMessages({
      limit: 20,
      roomId,
      skip: messages.length,
    });
  };

  return (
    <>
      <MessageListCard
        ref={ref}
        total={total}
        roomId={roomId}
        messages={messages}
        className={styles.MessageList}
        getState={getMessagesState} // {loading, error}
        isLoadmore={total > messages.length}
        isNewMessages={room.newMessageNumber}
        bottomMessagesBoxRef={bottomMessagesBoxRef}
        onLoadmore={handleLoadmore}
      >
        {aggregateMessages.map((m, i, msgsArr) => (
          <Stack
            key={m.id || m.keyMsg}
            spacing="1"
            w="100%"
            direction={m.senderId !== account.id ? 'row' : 'row-reverse'}
          >
            <Avatar
              name={m.senderId !== account.id
                ? room.membersObj?.[m.senderId]?.userName : account.userName}
              src={m.senderId !== account.id
                ? room.membersObj?.[m.senderId]?.avatar : account.avatar}
              size="sm"
              zIndex="2"
            />
            <HStack spacing="1" maxW="70%">
              {!!m.error && (
              <IconButton
                bg="transparent"
                icon={<RepeatIcon color="red.500" />}
              />
              )}
              {!m.aggregateMsg ? (
                <MessageContent
                  roomId={roomId}
                  message={m}
                  members={room.membersObj || {}}
                  showSeenUsers={i === msgsArr.length - 1}
                  onImageClick={() => {
                    if (m.contentType !== Message.CONTENT_TYPE_IMAGE) return;
                    setImgSrc(m.content);
                    onOpen();
                  }}
                />
              ) : (
                <Stack
                  spacing="2"
                  align={m.senderId !== account.id ? 'flex-start' : 'flex-end'}
                >
                  {m.aggregateMsg.map((mm, ii, aa) => (
                    <MessageContent
                      roomId={roomId}
                      key={mm.id || mm.keyMsg}
                      message={mm}
                      members={room.membersObj || {}}
                      showStatusMessage={ii === aa.length - 1}
                      showSeenUsers={i === msgsArr.length - 1}
                      onImageClick={() => {
                        if (mm.contentType !== Message.CONTENT_TYPE_IMAGE) { return; }
                        setImgSrc(mm.content);
                        onOpen();
                      }}
                    />
                  ))}
                </Stack>
              )}
            </HStack>
          </Stack>
        ))}
        <div ref={bottomMessagesBoxRef} />
      </MessageListCard>
      <ReviewImageModal isOpen={isOpen} onClose={onClose} imgSrc={imgSrc} />
    </>
  );
});

export default MessageList;
