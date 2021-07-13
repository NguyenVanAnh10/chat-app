import React, { forwardRef, useContext, useEffect, useLayoutEffect, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { Center, Spinner, VStack } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import { AccountContext } from 'App';
import useConversation from 'hooks/useConversation';

import styles from './MessageListCard.module.scss';

const MessageListCard = forwardRef(({
  conversationId, messages, getState: { loading, error }, bottomMessagesBoxRef, isNewMessages,
  className, children, isLoadmore, onLoadmore, threshold = 50, total, ...rest },
ref) => {
  const { account } = useContext(AccountContext);
  const [{ conversation, seeMessagesState }, { seeMessages }] = useConversation(conversationId);

  const prevScrollTopRef = useRef(0);
  const debounceRef = useRef();
  const prevconversationIdRef = useRef();
  const isChangeConversationRef = useRef();

  useEffect(() => {
    ref.current.addEventListener('scroll', handleScroll);
    return () => ref.current?.removeEventListener('scroll', handleScroll);
  }, [onLoadmore]);

  useLayoutEffect(() => {
    // check change conversation
    prevScrollTopRef.current = 0;
    if (prevconversationIdRef.current !== conversationId) {
      isChangeConversationRef.current = true;
    }
  }, [conversationId]);

  useLayoutEffect(() => {
    // set scrollbar at bottom when first time get messages
    if (isChangeConversationRef.current
       && (messages.length >= 20 || messages.length === total)) {
      prevconversationIdRef.current = conversationId;
      isChangeConversationRef.current = false;
      bottomMessagesBoxRef.current?.scrollIntoView(false);
    }
    if (isNewMessages) {
      bottomMessagesBoxRef.current?.scrollIntoView(false);
    }
  }, [messages]);

  useUpdateEffect(() => {
    // loadmore successful
    if (!isChangeConversationRef.current && !error && !loading
      && ref.current?.scrollTop <= threshold) {
      ref.current?.scrollTo({
        top: 100,
        left: 0,
        behavior: 'smooth',
      });
    }
  }, [loading, error]);

  const onHandleSeeNewMessages = e => {
    if (!conversation.newMessageNumber || seeMessagesState.loading
      || prevScrollTopRef.current <= e.target.scrollTop) return;
    seeMessages({
      conversationId,
      userId: account.id,
    });
  };

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
      w="100%"
      px="2"
      pt="2"
      pb="0"
      onScroll={onHandleSeeNewMessages}
      className={classNames(className, styles.MessageListCard)}
      {...rest}
    >
      {loading && isChangeConversationRef.current ? (
        <Center w="100%" className={className} {...rest}>
          <Spinner
            thickness="3px"
            speed="0.65s"
            emptyColor="gray.200"
            color="blue.300"
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
              color="blue.300"
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
