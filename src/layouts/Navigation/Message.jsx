import React, { useContext } from 'react';
import { Button, Icon } from '@chakra-ui/react';

import NewNotificationBadge from 'components/NewNotificationsBadge';
import { menuKeys } from 'configs/configs';
import { MenuContext } from 'contexts/menuContext';
import useMessages from 'hooks/useMessages';

const Message = ({ icon }) => {
  const [{ unseenMessagesState: { total } }] = useMessages({}, {
    forceFetchingUnseenMessages: true,
  });
  const { menuState, setMenuState } = useContext(MenuContext);

  return (
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
      isActive={menuState.active === menuKeys.MESSAGES}
      onClick={() => setMenuState(prev => ({ ...prev, active: menuKeys.MESSAGES }))}
    >
      <Icon fontSize="1.5rem" as={icon} />
      <NewNotificationBadge number={total} />
    </Button>
  );
};
export default Message;
