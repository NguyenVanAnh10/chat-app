import React, { useContext } from 'react';
import { VStack } from '@chakra-ui/react';

import { AccountContext } from 'App';

const BubbleMessage = ({ children, message }) => {
  const { account } = useContext(AccountContext);
  return (
    <VStack
      className="message"
      zIndex="1"
      bg={message.senderId === account.id ? 'blue.50' : 'gray.100'}
      borderRadius="xl"
      px="3"
      py="1"
      wordBreak="break-word"
    >
      {children}
    </VStack>
  );
};

export default BubbleMessage;
