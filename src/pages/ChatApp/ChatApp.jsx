import React, {
  useContext,
  useEffect as useReactEffect,
  createContext,
} from 'react';
import { Flex, useBreakpointValue, useDisclosure } from '@chakra-ui/react';

import { AccountContext } from 'App';
import { useModel } from 'model';
import SubSideNav from 'components/SubSideNav';
import ChatBox from 'components/ChatBox';
import MainSideNav from 'layouts/ChatApp/MainSideNav';

import useChat from 'hooks/useChat';
import CallingAlertModal from 'components/CallingAlertModal';
import VideoCallModal from 'components/VideoCallModal';
import useMenuContext, { MenuContext } from 'contexts/menuContext';
import MainContent from 'components/MainContent';

export const ChatContext = createContext({});

const ChatApp = () => {
  const { account } = useContext(AccountContext);
  const [, { getMessages }] = useModel('message', () => ({}));
  const { isOpen, onClose, onOpen: onOpenConversationModal } = useDisclosure();
  const { state: chatState, actions: chatActions } = useChat();

  const { caller, callState } = chatState;
  const { onDeclineCall, onAnswerCall } = chatActions;
  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  useReactEffect(() => {
    getMessages({ userId: account._id });
  }, []);
  return (
    <ChatContext.Provider value={{ state: chatState, actions: chatActions }}>
      {/* {!isMobileScreen ? <MainLayout /> : <MobileLayout />} */}
      <MainLayout />
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

const MainLayout = ({ children }) => {
  const [menuState, setMenuState] = useMenuContext();
  return (
    <MenuContext.Provider value={{ menuState, setMenuState }}>
      <Flex minH="100vh" w="100%">
        <Flex borderRight="1px solid rgba(0, 0, 0, 0.08)">
          <SubSideNav />
          <MainSideNav />
        </Flex>
        <MainContent />
      </Flex>
    </MenuContext.Provider>
  );
};

const MobileLayout = ({ selectedRoomId, setSelectedRoomId }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex w="100%">
      {!isOpen ? (
        <MainSideNav
          selectedRoomId={selectedRoomId}
          onSelectRoomId={roomId => {
            setSelectedRoomId(roomId);
            onOpen();
          }}
        />
      ) : (
        <ChatBox roomId={selectedRoomId} onBack={onClose} />
      )}
    </Flex>
  );
};
export default ChatApp;
