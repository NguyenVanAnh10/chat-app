import React, { useContext } from 'react';
import { Badge } from '@chakra-ui/react';

import { AccountContext } from 'App';
import { useModel } from 'model';

const NewMessageBadge = ({ icon }) => {
  const { account } = useContext(AccountContext);

  const [{ messages }] = useModel('message', ({ messages }) => ({ messages }));
  let newMessageNumber = 0;
  if (account._id) {
    newMessageNumber = Object.keys(messages).filter(
      id => messages[id]?.hadSeenMessageUsers
        && !messages[id].hadSeenMessageUsers?.includes(account._id),
    ).length;
  }
  return (
    <>
      {!!newMessageNumber && (
        <Badge
          bg="red"
          color="white"
          padding="1px 3px"
          fontWeight="bold"
          textAlign="center"
          borderRadius="100%"
          fontSize="0.7rem"
          top="-3"
          pos="relative"
        >
          {newMessageNumber > 9 ? '+9' : newMessageNumber}
        </Badge>
      )}
    </>
  );
};

export default NewMessageBadge;
