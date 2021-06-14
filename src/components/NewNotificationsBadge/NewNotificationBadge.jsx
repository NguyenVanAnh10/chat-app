import React from 'react';
import { Badge } from '@chakra-ui/react';

import { useModel } from 'model';

const NewNotificationBadge = () => {
  const [{ friendRequests }] = useModel('account', ({ me }) => ({
    friendRequests: me.friendRequests,
  }));

  return (
    <>
      {!!friendRequests.length && (
        <Badge
          bg="red"
          color="white"
          padding="1px 4px"
          fontWeight="bold"
          textAlign="center"
          borderRadius="100%"
          fontSize="0.8rem"
          top="4"
          right="3"
          pos="absolute"
        >
          {friendRequests.length > 9 ? '+9' : friendRequests.length}
        </Badge>
      )}
    </>
  );
};

export default NewNotificationBadge;
