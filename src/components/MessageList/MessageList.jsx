import React, { useContext, useEffect, useRef, useState } from 'react';
import {
  Avatar,
  HStack,
  IconButton,
  Stack,
  useDisclosure,
  VStack,
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

const MessageList = ({ roomId }) => {
  const [{ messages, loading }] = useMessages(roomId, {
    fetchData: true,
  });

  const [{ room }] = useRoom(roomId);
  const { account } = useContext(AccountContext);
  const containerRef = useRef();
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
  useEffect(() => {
    !loading && containerRef.current.scrollIntoView(false);
  }, [messages, loading]);

  return (
    <MessageListCard className={styles.MessageList} loading={loading}>
      <VStack mt="5" ref={containerRef} spacing="3" alignItems="flex-start">
        {aggregateMessages.map(m => (
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
                  containerRef={containerRef}
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
                      containerRef={containerRef}
                      showStatusMessage={ii === aa.length - 1}
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
      </VStack>
      <ReviewImageModal isOpen={isOpen} onClose={onClose} imgSrc={imgSrc} />
    </MessageListCard>
  );
};

export default MessageList;
