import React from 'react';
import { Avatar, AvatarGroup, HStack, Text } from '@chakra-ui/react';
import dayjs from 'dayjs';

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
            && message.hadSeenMessageUsers.length === 1 && (
              <Text fontSize="xs">
                {message.status ? 'Delivered' : 'Sending'}
              </Text>
      )}
      {!!message.error && <Text fontSize="xs">Sending Error</Text>}
    </>
    )}
    {showSeenUsers && message.hadSeenMessageUsers.length > 1 && (
    <AvatarGroup spacing="0.5" max="3" size="2xs" fontSize="xs">
      {message.hadSeenMessageUsers
        .filter(id => id !== message.senderId && id !== account.id)
        .map(userId => (
          <Avatar
            key={userId}
            border="none"
            name={members[userId]?.userName}
          />
        ))}
    </AvatarGroup>
    )}
  </HStack>
);

export default MessageStatus;
