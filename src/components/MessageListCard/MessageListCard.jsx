import React from 'react';
import { Box, Center, Spinner } from '@chakra-ui/react';

const MessageListCard = ({ loading, className, children, ...rest }) => {
  if (loading) {
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
    <Box w="100%" px="2" className={className} {...rest}>
      {children}
    </Box>
  );
};
export default MessageListCard;
