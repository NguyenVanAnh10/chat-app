import React, { useCallback, useContext } from 'react';
import { AvatarGroup, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

import Avatar from 'components/Avatar';
import useUsers from 'hooks/useUsers';
import { AccountContext } from 'App';

const MessageStatus = ({
  message,
  showTime = true,
  showSeenUsers = true,
  showStatus = true,
}) => {
  const [{ users }] = useUsers();
  const { account } = useContext(AccountContext);

  const renderStatus = useCallback(() => {
    if (message.sender !== account.id || !!message.usersSeen?.length) return null;
    if (message.error) return <Text fontSize="xs">Sending Error</Text>;
    return (
      <Text fontSize="xs">
        {message.sending ? 'Sending' : 'Delivered' }
      </Text>
    );
  }, [message]);

  return (
    <HStack
      spacing="5"
      color="blackAlpha.600"
      w="100%"
      justifyContent="space-between"
    >
      {showTime && (
      <Text fontSize="xs">{dayjs(message.createdAt).format('h:mm A')}</Text>
      )}
      {showStatus && renderStatus()}
      {showSeenUsers && !!message.usersSeen?.length && (
      <AvatarGroup spacing="0.5" max="3" size="2xs" fontSize="xs">
        {message.usersSeen
          .filter(id => id !== message.sender && id !== account.id)
          .map(userId => (
            <Avatar
              key={userId}
              showBorder={false}
              name={users[userId]?.userName}
              src={users[userId]?.avatar}
            />
          ))}
      </AvatarGroup>
      )}
    </HStack>
  );
};

export default MessageStatus;
