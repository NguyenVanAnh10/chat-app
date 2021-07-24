import React from 'react';
import {
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
} from '@chakra-ui/react';

import ListItem from 'components/ListItem';
import Notification from 'entities/Notification';
import NotificationItem from 'components/NotificationItem';
import usefriends from 'hooks/useFriends';
import FriendShip from 'entities/FriendShip';

const NotificationDrawers = ({ isOpen, onClose }) => {
  const [{ friendRequestRequesters }, { confirmFriendRequest }] = usefriends({
    forceFetchingFriendRequesters: true,
  });

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Notifications</DrawerHeader>
        <DrawerBody>
          <ListItem
            mt="3"
            spacing="7"
            data={friendRequestRequesters}
            emptyText="No notification"
            renderItem={friend => (
              <NotificationItem
                friend={friend}
                typeNotification={Notification.NOTIFICATION_FRIEND_REQUEST}
                onConfirm={() => confirmFriendRequest({
                  friendshipId: friend.friendship.id,
                  status: FriendShip.ACCEPTED,
                })}
              />
            )}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDrawers;
