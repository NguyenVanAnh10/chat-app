import React, { useContext } from 'react';
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
import { useModel } from 'model';
import { AccountContext } from 'App';

const NotificationDrawers = ({ isOpen, onClose }) => {
  const { account } = useContext(AccountContext);

  const [{ friendRequests }, { confirmFriendRequest }] = useModel('account', ({ me, users }) => ({
    friendRequests: me.friendRequests.map(f => ({ ...users[f.friendId], ...f })),
  }));

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
            data={friendRequests}
            emptyText="No notification"
            renderItem={friend => (
              <NotificationItem
                friend={friend}
                typeNotification={Notification.NOTIFICATION_FRIEND_REQUEST}
                onConfirm={() => confirmFriendRequest({
                  userId: account.id,
                  friendId: friend.friendId,
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
