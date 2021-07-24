import React, { forwardRef, useContext } from 'react';
import { VStack } from '@chakra-ui/react';

import { AccountContext } from 'App';

const BubbleMessage = forwardRef(({ children, message }, ref) => {
  const { account } = useContext(AccountContext);

  return (
    <VStack
      ref={ref}
      className="message"
      zIndex="1"
      bg={(message.error && 'red.100') || (message.sender === account.id ? 'blue.50' : 'gray.100')}
      borderRadius="xl"
      px="3"
      py="1"
      wordBreak="break-word"
    >
      {children}
    </VStack>
  );
});

export default BubbleMessage;
