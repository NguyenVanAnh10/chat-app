import React from 'react';
import {
  AvatarBadge,
  Button,
  ButtonGroup,
  HStack,
  Text,
  VStack,
} from '@chakra-ui/react';

import Avatar from 'components/Avatar';
import Notification from 'entities/Notification';

const NotificationItem = ({ typeNotification, friend, onConfirm, onDelete }) => {
  switch (typeNotification) {
    case Notification.NOTIFICATION_FRIEND_REQUEST:
      return (
        <HStack spacing="4" align="flex-start">
          <Avatar name={friend.userName} src={friend.avatar}>
            <AvatarBadge boxSize="0.8em" bg="green.500" />
          </Avatar>
          <VStack align="flex-start">
            <Text>
              <strong>{friend.userName}</strong>
                &nbsp; sent you a friend request
            </Text>
            <ButtonGroup size="sm" spacing="2">
              <Button colorScheme="blue" onClick={onConfirm}>Confirm</Button>
              <Button onClick={onDelete}>Delete</Button>
            </ButtonGroup>
          </VStack>
        </HStack>
      );

    default:
      return typeNotification;
  }
};

export default NotificationItem;
