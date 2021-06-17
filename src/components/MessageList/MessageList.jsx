import React, { useContext, useState, forwardRef } from 'react';
import {
  Avatar,
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

import styles from './MessageList.module.scss';

const MessageList = forwardRef(({ roomId }, ref) => {
  const [{ messages, getMessagesState, total }, { loadMoreMessages }] = useMessages(roomId, {
    fetchData: true,
  });

  const [{ room }] = useRoom(roomId);
  const { account } = useContext(AccountContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imgSrc, setImgSrc] = useState();

  // TODO aggregate messages
  const aggregateMessages = messages.reduce((s, c, index, msgArr) => {
    if (!index || msgArr[index - 1].senderId !== c.senderId) {
      return [...s, c];
    }
    return [
      ...(s.length > 1 ? s.slice(0, s.length - 1) : []),
      {
        ...c,
        aggregateMsg: s[s.length - 1]?.aggregateMsg
          ? [...s[s.length - 1]?.aggregateMsg, c]
          : [s[s.length - 1], c],
      },
    ];
  }, []);

  const members = room.members.reduce((s, m) => ({ ...s, [m.id]: m }), {});

  const handleLoadmore = () => {
    loadMoreMessages({
      limit: 10,
      roomId,
      skip: messages.length,
    });
  };

  return (
    <>
      <MessageListCard
        ref={ref}
        roomId={roomId}
        className={styles.MessageList}
        messages={messages}
        getState={getMessagesState} // {loading, error}
        onLoadmore={handleLoadmore}
        isLoadmore={total > messages.length}
      >
        {aggregateMessages.map((m, i, msgsArr) => (
          <Stack
            key={m.id || m.keyMsg}
            spacing="1"
            w="100%"
            direction={m.senderId !== account.id ? 'row' : 'row-reverse'}
          >
            <Avatar
              name={members[m.senderId]?.userName || 'N/A'}
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
                  members={members}
                  messagesContainerRef={ref}
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
                      members={members}
                      messagesContainerRef={ref}
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
      </MessageListCard>
      <ReviewImageModal isOpen={isOpen} onClose={onClose} imgSrc={imgSrc} />
    </>
  );
});

export default MessageList;
