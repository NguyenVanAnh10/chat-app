import React, { useEffect, useLayoutEffect, useRef } from 'react';
import { useUpdateEffect } from 'react-use';
import { Box, Center, Spinner } from '@chakra-ui/react';
import debounce from 'lodash.debounce';
// TODO refactor
const MessageListCard = ({ roomId, messages,
  loading, className, children, onLoadmore, threshold = 50, ...rest }) => {
  const containerRef = useRef();
  const prevScrollTopRef = useRef(0);
  const debounceRef = useRef();
  const prevRoomIdRef = useRef();
  const isChangeRoomRef = useRef();

  useEffect(() => {
    containerRef.current?.addEventListener('scroll', handleScroll);
    return () => containerRef.current?.removeEventListener('scroll', handleScroll);
  }, [roomId, loading]);
  useLayoutEffect(() => {
    prevScrollTopRef.current = 0;
    if (prevRoomIdRef.current !== roomId) {
      isChangeRoomRef.current = true;
    }
  }, [roomId]);

  useUpdateEffect(() => {
    if (isChangeRoomRef.current && !!messages.length && containerRef.current) {
      prevRoomIdRef.current = roomId;
      isChangeRoomRef.current = false;
      containerRef.current.scrollTop = containerRef.current.scrollHeight
        - containerRef.current.clientHeight;
    }
  }, [messages]);

  const handleScroll = e => {
    if (containerRef.current?.scrollTop > threshold
      || prevScrollTopRef.current <= e.target.scrollTop) {
      prevScrollTopRef.current = e.target.scrollTop;
      return;
    }
    prevScrollTopRef.current = e.target.scrollTop;
    debounceRef.current?.cancel();
    debounceRef.current = debounce(() => onLoadmore(containerRef.current), 300);
    debounceRef.current();
  };

  if (loading && isChangeRoomRef.current) {
    return (
      <Center w="100%" className={className} {...rest}>
        <Spinner
          thickness="3px"
          speed="0.65s"
          emptyColor="gray.200"
          color="orange.300"
          size="lg"
        />
      </Center>
    );
  }
  return (
    <Box ref={containerRef} w="100%" px="2" className={className} {...rest}>
      {children}
    </Box>
  );
};
export default MessageListCard;
