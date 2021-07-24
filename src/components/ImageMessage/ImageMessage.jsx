import React, { useState, useContext } from 'react';
import { Image, VStack } from '@chakra-ui/react';

import MessageStatus from 'components/MessageStatus';
import { AccountContext } from 'App';

const ImageMessage = ({
  message, onClick,
}) => {
  const [visible, setVisible] = useState(false);
  const { account } = useContext(AccountContext);
  return (
    <VStack
      mr="2"
      alignItems="flex-end"
      cursor="pointer"
      onClick={() => visible && onClick()}
    >
      <Image
        maxW="100%"
        maxH={200}
        borderRadius="lg"
        objectFit="contain"
        display={!visible ? 'block' : 'none'}
        objectPosition={message.sender === account.id ? 'right' : 'left'}
        src={message.contentBlob}
        // onLoad={() => {
        //   containerRef.current.scrollIntoView(false);
        // }}
      />
      <Image
        maxW="100%"
        maxH={200}
        borderRadius="lg"
        objectFit="contain"
        display={visible ? 'block' : 'none'}
        objectPosition={message.senderId === account.id ? 'right' : 'left'}
        src={message.content}
        onLoad={() => {
          setVisible(true);
          // containerRef.current.scrollIntoView(false);
          URL.revokeObjectURL(message.contentBlob);
          // containerRef.current.scrollIntoView(false);
          // setTimeout(() => URL.revokeObjectURL(message.contentBlob), 100);
        }}
      />
      <MessageStatus message={message} />
    </VStack>
  );
};

export default ImageMessage;
