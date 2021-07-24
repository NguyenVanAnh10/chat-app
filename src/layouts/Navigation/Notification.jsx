import React from 'react';

import NotificationDrawers from 'components/NotificationDrawer';
import { Button, Icon, useDisclosure } from '@chakra-ui/react';
import NewNotificationBadge from 'components/NewNotificationsBadge';
import { useModel } from 'model';

const Notification = ({ icon }) => {
  const { onClose, onOpen, isOpen } = useDisclosure();
  const [{ friendRequesters }] = useModel('account', state => ({
    friendRequesters: state.requesters.ids,
  }));

  return (
    <>
      <Button
        p="5"
        h="100%"
        w="100%"
        flex="1"
        color="white"
        _focus="none"
        bg="transparent"
        borderRadius="none"
        _active={{ bg: 'blue.400' }}
        _hover={{ bg: 'blue.300' }}
        onClick={onOpen}
      >
        <Icon fontSize="1.5rem" as={icon} />
        <NewNotificationBadge number={friendRequesters.length} />
      </Button>
      <NotificationDrawers
        isOpen={isOpen}
        onClose={onClose}
      />
    </>
  );
};
export default Notification;
