import React, { Fragment, useContext, useState, forwardRef, useRef, useLayoutEffect } from 'react';
import { HStack, IconButton, Stack, useDisclosure } from '@chakra-ui/react';
import { RepeatIcon } from '@chakra-ui/icons';
import { usePrevious } from 'react-use';

import { AccountContext } from 'App';
import MessageListCard from 'components/MessageListCard';
import ReviewImageModal from 'components/ReviewImageModal';
import MessageContent from 'components/MessageContent';
import Message from 'entities/Message';
import Avatar from 'components/Avatar';
import useMessages from 'hooks/useMessages';
import useUsers from 'hooks/useUsers';
import { MenuContext } from 'contexts/menuContext';

const MessageList = forwardRef(({ bottomMessagesBoxRef }, ref) => {
  const { menuState } = useContext(MenuContext);
  const { conversationId } = menuState[menuState.active];

  const [
    {
      messages,
      messagesState: { total, loading, error, ids },
    },
    { getMessages, sendMessage },
  ] = useMessages({ conversationId }, { forceFetchingMessages: true });
  const [{ users }] = useUsers();

  const { account } = useContext(AccountContext);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [imgSrc, setImgSrc] = useState();

  const handleLoadmore = () => {
    if (ids?.length >= total) return;
    getMessages({
      limit: 20,
      conversationId,
      cachedKey: conversationId,
      skip: ids?.length,
    });
  };

  const lastMessageRef = useRef();
  const prevMessageNumber = usePrevious(ids?.length);

  useLayoutEffect(() => {
    if (!prevMessageNumber && !loading && !error) {
      bottomMessagesBoxRef.current?.scrollIntoView(false);
      return;
    }
    if (prevMessageNumber && !loading && !error && lastMessageRef.current) {
      ref.current.scrollTop = lastMessageRef.current.offsetTop - 8;
    }
  }, [loading]);

  useLayoutEffect(() => {
    bottomMessagesBoxRef.current?.scrollIntoView(false);
  }, [conversationId, menuState.active]);

  return (
    <>
      <MessageListCard
        ref={ref}
        total={total}
        hasLoadmore={ids?.length < total}
        firstLoading={loading && typeof prevMessageNumber === 'undefined'}
        loadingMore={loading && typeof prevMessageNumber !== 'undefined'}
        onLoadmore={handleLoadmore}
      >
        {messages.map((m, i) => (
          <Stack
            key={m.id || m.keyMsg}
            spacing="1"
            w="100%"
            direction={m.sender !== account.id ? 'row' : 'row-reverse'}
          >
            <Avatar
              name={users[m.sender]?.userName}
              src={users[m.sender]?.avatar}
              size="sm"
              zIndex="2"
            />
            <HStack spacing="1" maxW="70%">
              {!m.aggregateMsg ? (
                <HStack ref={i === 0 ? lastMessageRef : null}>
                  {!!m.error && (
                    <IconButton
                      bg="transparent"
                      icon={<RepeatIcon color="red.500" />}
                      onClick={() => {
                        // resend
                        sendMessage(m);
                      }}
                    />
                  )}
                  <MessageContent
                    message={m}
                    showSeenUsers
                    onImageClick={() => {
                      if (m.contentType !== Message.CONTENT_TYPE_IMAGE) return;
                      setImgSrc(m.content);
                      onOpen();
                    }}
                  />
                </HStack>
              ) : (
                <Stack spacing="2" align={m.sender !== account.id ? 'flex-start' : 'flex-end'}>
                  {m.aggregateMsg.map((mm, ii, aa) => (
                    <HStack
                      key={mm.id || mm.keyMsg}
                      ref={i === 0 && ii === 0 ? lastMessageRef : null}
                    >
                      {!!mm.error && (
                        <IconButton
                          bg="transparent"
                          icon={<RepeatIcon color="red.500" />}
                          onClick={() => {
                            // resend
                            sendMessage(mm);
                          }}
                        />
                      )}
                      <MessageContent
                        message={mm}
                        showStatusMessage={ii === aa.length - 1}
                        showSeenUsers={ii === aa.length - 1}
                        onImageClick={() => {
                          if (mm.contentType !== Message.CONTENT_TYPE_IMAGE) {
                            return;
                          }
                          setImgSrc(mm.content);
                          onOpen();
                        }}
                      />
                    </HStack>
                  ))}
                </Stack>
              )}
            </HStack>
          </Stack>
        ))}
        <div className="bottom-anchor-scroller" ref={bottomMessagesBoxRef}>
          &nbsp;
        </div>
      </MessageListCard>
      <ReviewImageModal isOpen={isOpen} onClose={onClose} imgSrc={imgSrc} />
    </>
  );
});

export default MessageList;
