import React from 'react';
import { AvatarGroup, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

import Avatar from 'components/Avatar';

const MessageStatus = ({
  message,
  account,
  members,
  showTime = true,
  showSeenUsers = true,
  showStatus = true,
}) => (
  <HStack
    spacing="5"
    color="blackAlpha.600"
    w="100%"
    justifyContent="space-between"
  >
    {showTime && (
    <Text fontSize="xs">{dayjs(message.createAt).format('h:mm A')}</Text>
    )}
    {showStatus && (
    <>
      {message.senderId === account.id
            && !message.error
            && message.usersSeenMessage.length === 1 && (
              <Text fontSize="xs">
                {message.status ? 'Delivered' : 'Sending'}
              </Text>
      )}
      {!!message.error && <Text fontSize="xs">Sending Error</Text>}
    </>
    )}
    {showSeenUsers && message.usersSeenMessage.length > 1 && (
    <AvatarGroup spacing="0.5" max="3" size="2xs" fontSize="xs">
      {message.usersSeenMessage
        .filter(id => id !== message.senderId && id !== account.id)
        .map(userId => (
          <Avatar
            key={userId}
            showBorder={false}
            name={members[userId]?.userName}
            src={members[userId]?.avatar}
          />
        ))}
    </AvatarGroup>
    )}
  </HStack>
);

export default MessageStatus;
