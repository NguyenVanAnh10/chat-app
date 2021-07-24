import React, { useContext } from 'react';
import { Flex } from '@chakra-ui/react';

import ConversationList from 'components/ConversationList';
import FriendList from 'components/FriendList';
import SearchUserButton from 'components/SearchUserButton';
import { MenuContext } from 'contexts/menuContext';
import { menuKeys } from 'configs/configs';

const MainSideNav = () => {
  const { menuState, setMenuState } = useContext(MenuContext);
  return (
    <Flex
      p="2"
      flex="1"
      zIndex="3"
      bg="white"
      width={300}
      flexDir="column"
      transition="width 0.3s ease"
    >
      <Flex
        h="4rem"
        alignItems="center"
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
      >
        <SearchUserButton
          onSelectUser={id => setMenuState(prev => ({
            ...prev,
            [menuState.active]: { conversationId: id },
          }))}
        />
      </Flex>
      <SideNavContent />
    </Flex>
  );
};

const SideNavContent = () => {
  const { menuState } = useContext(MenuContext);

  switch (menuState.active) {
    case menuKeys.CONTACT_BOOK:
      return <FriendList />;
    default:
      return <ConversationList />;
  }
};
export default MainSideNav;
