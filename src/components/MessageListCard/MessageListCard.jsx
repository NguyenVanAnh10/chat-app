import React, { forwardRef, useEffect, useRef } from 'react';
import { Center, Spinner, VStack } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
import classNames from 'classnames';

import styles from './MessageListCard.module.scss';
import useUserScroll from 'hooks/useUserScroll';

const MessageListCard = forwardRef(({
  firstLoading,
  loadingMore,
  bottomMessagesBoxRef,
  className,
  children,
  onLoadmore,
  hasLoadmore,
  threshold = 50,
  ...rest
}, ref) => {
  const debounceRef = useRef();
  const childrenRef = useRef();

  useUserScroll(ref, () => {
    if (!hasLoadmore || firstLoading || loadingMore || ref.current?.scrollTop > threshold) {
      return;
    }
    debounceRef.current?.cancel();
    debounceRef.current = debounce(() => {
      onLoadmore();
    }, 300);
    debounceRef.current();
  }, [onLoadmore], { direction: 'up' });

  useEffect(() => {
    if (!hasLoadmore || firstLoading || loadingMore
      || !(childrenRef.current?.clientHeight <= ref.current?.clientHeight)) return;
    debounceRef.current?.cancel();
    debounceRef.current = debounce(() => {
      onLoadmore();
    }, 300);
    debounceRef.current();
  }, [onLoadmore]);

  return (
    <VStack
      ref={ref}
      spacing="3"
      alignItems="flex-start"
      w="100%"
      px="2"
      pt="2"
      pb="0"
      pos="relative"
      overflowY="auto"
      className={classNames(className, styles.MessageListCard)}
      {...rest}
    >
      {firstLoading ? (
        <Center h="100%" w="100%" className={className} {...rest}>
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
          {hasLoadmore && (
          <Center
            w="100%"
            opacity={loadingMore ? 1 : 0}
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
          <VStack w="100%" ref={childrenRef}>
            {children}
          </VStack>
        </>
      )}
    </VStack>
  );
});
export default MessageListCard;
