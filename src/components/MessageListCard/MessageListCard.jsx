import React, { forwardRef, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { Center, Spinner, VStack } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import styles from './MessageListCard.module.scss';
import { useModel } from 'model';
import { AccountContext } from 'App';
import useRoom from 'hooks/useRoom';

const MessageListCard = forwardRef(({
  roomId, messages, getState: { loading, error }, bottomMessagesBoxRef, isNewMessages,
  className, children, isLoadmore, onLoadmore, threshold = 50, total, ...rest },
ref) => {
  const { account } = useContext(AccountContext);
  const [{ room }] = useRoom(roomId);
  const [, { haveSeenNewMessages }] = useModel(
    'message',
    () => ({}),
  );

  const prevScrollTopRef = useRef(0);
  const debounceRef = useRef();
  const prevRoomIdRef = useRef();
  const isChangeRoomRef = useRef();

  useEffect(() => {
    ref.current.addEventListener('scroll', handleScroll);
    return () => ref.current?.removeEventListener('scroll', handleScroll);
  }, [onLoadmore]);

  useLayoutEffect(() => {
    // check change room
    prevScrollTopRef.current = 0;
    if (prevRoomIdRef.current !== roomId) {
      isChangeRoomRef.current = true;
    }
  }, [roomId]);

  useLayoutEffect(() => {
    // set scrollbar at bottom when first time get messages
    if (isChangeRoomRef.current
       && (messages.length >= 20 || messages.length === total)) {
      prevRoomIdRef.current = roomId;
      isChangeRoomRef.current = false;
      bottomMessagesBoxRef.current?.scrollIntoView(false);
    }
    if (isNewMessages) {
      bottomMessagesBoxRef.current?.scrollIntoView(false);
    }
  }, [messages]);

  useUpdateEffect(() => {
    // loadmore successful
    if (!isChangeRoomRef.current && !error && !loading
      && ref.current?.scrollTop <= threshold) {
      ref.current?.scrollTo({
        top: 100,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [loading, error]);

  const handleScroll = e => {
    if (!isLoadmore || loading || ref.current?.scrollTop > threshold
      || prevScrollTopRef.current <= e.target.scrollTop) { // check scrolling up
      prevScrollTopRef.current = e.target.scrollTop;
      return;
    }
    prevScrollTopRef.current = e.target.scrollTop;
    debounceRef.current?.cancel();
    debounceRef.current = debounce(() => {
      onLoadmore();
    }, 300);
    debounceRef.current();
  };
  const onHandleSeenNewMessage = e => {
    if (!room.newMessageNumber || prevScrollTopRef.current <= e.target.scrollTop) return;
    haveSeenNewMessages({ roomId, userId: account.id });
  };

  return (
    <VStack
      ref={ref}
      spacing="3"
      alignItems="flex-start"
      w="100%"
      p="2"
      onScroll={onHandleSeenNewMessage}
      className={classNames(className, styles.MessageListCard)}
      {...rest}
    >
      {loading && isChangeRoomRef.current ? (
        <Center w="100%" className={className} {...rest}>
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="orange.300"
            size="lg"
          />
        </Center>
      ) : (
        <>
          {isLoadmore && (
          <Center
            w="100%"
            opacity={loading ? 1 : 0}
          >
            <Spinner
              thickness="3px"
              speed="0.65s"
              emptyColor="gray.200"
              color="orange.300"
              size="md"
            />
          </Center>
          )}
          {children}
        </>
      )}
    </VStack>
  );
});
export default MessageListCard;
