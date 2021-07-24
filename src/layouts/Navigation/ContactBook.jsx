import React, { useContext } from 'react';
import { Button, Icon } from '@chakra-ui/react';

import { menuKeys } from 'configs/configs';
import { MenuContext } from 'contexts/menuContext';

const ContactBook = ({ icon }) => {
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
      isActive={menuState.active === menuKeys.CONTACT_BOOK}
      onClick={() => setMenuState(prev => ({ ...prev, active: menuKeys.CONTACT_BOOK }))}
    >
      <Icon fontSize="1.5rem" as={icon} />
    </Button>
  );
};
export default ContactBook;
