import React from "react";
import {
  Avatar,
  AvatarBadge,
  AvatarGroup,
  Button,
  ButtonGroup,
  HStack,
  Text,
  VStack,
} from "@chakra-ui/react";

import Notification from "entities/Notification";

const NotificationItem = ({ typeNotification, room }) => {
  switch (typeNotification) {
    case Notification.NOTIFICATION_FRIEND_REQUEST:
      return (
        <HStack spacing="4" align="flex-start">
          <AvatarGroup size="md" max={3}>
            {room.otherMembers.length > 1
              ? room.members.map((o) => (
                  <Avatar key={o._id} name={o.userName}>
                    <AvatarBadge boxSize="0.8em" bg="green.500" />
                  </Avatar>
                ))
              : room.otherMembers.map((o) => (
                  <Avatar key={o._id} name={o.userName}>
                    <AvatarBadge boxSize="0.8em" bg="green.500" />
                  </Avatar>
                ))}
          </AvatarGroup>
          <VStack align="flex-start">
            <Text>
              <strong>{room.userName}</strong>&nbsp; sent a friend request
            </Text>
            <ButtonGroup size="sm" spacing="2">
              <Button colorScheme="blue">Confirm</Button>
              <Button>Delete</Button>
            </ButtonGroup>
          </VStack>
        </HStack>
      );

    default:
      return typeNotification;
  }
};

export default NotificationItem;
