import React from 'react';
import { Badge } from '@chakra-ui/react';

const NewNotificationBadge = ({ number }) => (
  !!number && (
    <Badge
      bg="red"
      color="white"
      padding="1px 4px"
      fontWeight="bold"
      textAlign="center"
      borderRadius="100%"
      fontSize="0.8rem"
      right="calc(50% - 17px)"
      top="calc(50% - 20px)"
      pos="absolute"
    >
      {number > 9 ? '+9' : number}
    </Badge>
  )

);

export default NewNotificationBadge;
