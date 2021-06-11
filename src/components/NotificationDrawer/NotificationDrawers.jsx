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
import { useRooms } from 'hooks/useRoom';
import { menuKeys } from 'configs/configs';
import Notification from 'entities/Notification';
import NotificationItem from 'components/NotificationItem';

const NotificationDrawers = ({ isOpen, onClose }) => {
  const [{ rooms }] = useRooms(menuKeys.CONTACT_BOOK);

  return (
    <Drawer
      isOpen={isOpen}
      placement="left"
      closeOnOverlayClick={false}
      onClose={onClose}
    >
      <DrawerOverlay />
      <DrawerContent>
        <DrawerCloseButton />
        <DrawerHeader>Notification</DrawerHeader>
        <DrawerBody>
          <ListItem
            mt="3"
            spacing="7"
            data={rooms}
            renderItem={room => (
              <NotificationItem
                room={room}
                typeNotification={Notification.NOTIFICATION_FRIEND_REQUEST}
              />
            )}
          />
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default NotificationDrawers;
