import React, { useContext } from 'react';

import { MenuContext } from 'contexts/menuContext';
import ChatBox from 'components/ChatBox';
import { menuKeys } from 'configs/configs';

const MainContent = () => {
  const { menuState } = useContext(MenuContext);
  switch (menuState.active) {
    case menuKeys.CONTACT_BOOK:
      return <ChatBox conversationId={menuState[menuState.active]?.conversationId} />;
    default:
      return <ChatBox conversationId={menuState[menuState.active]?.conversationId} />;
  }
};
export default MainContent;
