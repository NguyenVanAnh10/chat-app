import React, { forwardRef, useEffect, useLayoutEffect, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { Center, Spinner, VStack } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import styles from './MessageListCard.module.scss';

const MessageListCard = forwardRef(({
  roomId, messages, getState: { loading, error },
  className, children, isLoadmore, onLoadmore, threshold = 50, ...rest },
ref) => {
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
    if (isChangeRoomRef.current && !!messages.length) {
      prevRoomIdRef.current = roomId;
      isChangeRoomRef.current = false;
      // eslint-disable-next-line no-param-reassign
      ref.current.scrollTop = ref.current.scrollHeight
        - ref.current.clientHeight;
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

  return (
    <VStack
      ref={ref}
      spacing="3"
      alignItems="flex-start"
      jus
      w="100%"
      px="2"
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
