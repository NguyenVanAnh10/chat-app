import React, { useContext } from 'react';
import { Flex } from '@chakra-ui/react';

import ConversationList from 'components/ConversationList';
import SearchUserButton from 'components/SearchUserButton';
import { MenuContext } from 'contexts/menuContext';

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
      <MainSideNavContent mainSideType={menuState.active} />
    </Flex>
  );
};

// TODO: have many type main side nav in the future
const MainSideNavContent = ({
  mainSideType,
}) => <ConversationList conversationListType={mainSideType} />;
export default MainSideNav;
