import React, { useContext, createContext } from 'react';
import { Flex, useBreakpointValue, useDisclosure } from '@chakra-ui/react';

import MainSideNav from 'layouts/ChatApp/MainSideNav';
import SubSideNav from 'layouts/ChatApp/SubSideNav';

import useChat from 'hooks/useChat';
import CallingAlertModal from 'components/CallingAlertModal';
import VideoCallModal from 'components/VideoCallModal';
import useMenuContext, { MenuContext } from 'contexts/menuContext';
import ChatBox from 'components/ChatBox';
import Welcome from 'components/Welcome/Welcome';

export const ChatContext = createContext({});

const ChatApp = () => {
  const { isOpen, onClose, onOpen: onOpenConversationModal } = useDisclosure();
  const { state: chatState, actions: chatActions } = useChat();
  const [menuState, setMenuState] = useMenuContext();

  const { caller, callState } = chatState;
  const { onDeclineCall, onAnswerCall } = chatActions;
  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  return (
    <ChatContext.Provider value={{ state: chatState, actions: chatActions }}>
      <MenuContext.Provider value={{ menuState, setMenuState }}>
        {!isMobileScreen ? <MainLayout /> : <MobileLayout />}
      </MenuContext.Provider>
      <CallingAlertModal
        callerId={caller.id}
        isOpen={callState.hasReceived}
        onDecline={() => onDeclineCall(caller.id)}
        onAnswer={() => {
          onOpenConversationModal();
          onAnswerCall();
        }}
      />
      <VideoCallModal isOpen={isOpen} onClose={onClose} />
    </ChatContext.Provider>
  );
};

const MainLayout = () => {
  const { menuState } = useContext(MenuContext);
  return (
    <Flex h="100vh" w="100%" overflow="hidden">
      <Flex borderRight="1px solid rgba(0, 0, 0, 0.08)">
        <SubSideNav />
        <MainSideNav />
      </Flex>
      {(menuState[menuState.active]?.conversationId
      || menuState[menuState.active]?.friendId)
        ? <ChatBox /> : <Welcome />}
    </Flex>
  );
};

const MobileLayout = () => {
  const { menuState } = useContext(MenuContext);

  return (
    <Flex h="100%" w="100%" overflow="hidden">
      {(menuState[menuState.active]?.conversationId
      || menuState[menuState.active]?.friendId) ? (
        <ChatBox />
        ) : (
          <>
            <MainSideNav />
            <SubSideNav />
          </>
        )}
    </Flex>
  );
};
export default ChatApp;
