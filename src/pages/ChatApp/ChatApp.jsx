import React, { useContext, createContext, useRef } from 'react';
import { Flex, useBreakpointValue } from '@chakra-ui/react';
import { Switch, Route } from 'react-router-dom';

import MainSideNav from 'layouts/ChatApp/MainSideNav';
import SubSideNav from 'layouts/ChatApp/SubSideNav';
import useChat from 'hooks/useChat';
import CallingAlertModal from 'components/CallingAlertModal';
import useMenuContext, { MenuContext } from 'contexts/menuContext';
import ChatBox from 'components/ChatBox';
import Welcome from 'components/Welcome/Welcome';
import OutgoingCall from 'pages/OutgoingCall';
import IncomingCall from 'pages/IncomingCall';
import HelmetWrapper from 'components/HelmetWrapper';

export const ChatContext = createContext({});

const ChatApp = () => {
  const [chatState, action] = useChat();
  const [menuState, setMenuState] = useMenuContext();
  const incomingCallWindow = useRef();

  return (
    <ChatContext.Provider value={[{ ...chatState, incomingCallWindow }, action]}>
      <MenuContext.Provider value={{ menuState, setMenuState }}>
        <Switch>
          <Route exact path="/" render={() => <ChatContainer />} />
          <Route exact path="/call/outgoing" component={OutgoingCall} />
          <Route exact path="/call/incoming" component={IncomingCall} />
        </Switch>
      </MenuContext.Provider>
    </ChatContext.Provider>
  );
};

const ChatContainer = () => {
  const [{ caller, callState, conversationId }, { onDeclineCall, onAcceptCall }] =
    useContext(ChatContext);
  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  return (
    <>
      {!isMobileScreen ? <MainLayout /> : <MobileLayout />}
      <CallingAlertModal
        callerId={caller.id}
        conversationId={conversationId}
        isOpen={callState.hasReceived}
        onDecline={() => onDeclineCall(caller.id)}
        onAcceptCall={onAcceptCall}
        remoteSignal={caller.signal}
      />
      <HelmetWrapper callerId={caller.id} isIncomingCall={callState.hasReceived} />
    </>
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
      {menuState[menuState.active]?.conversationId || menuState[menuState.active]?.friendId ? (
        <ChatBox />
      ) : (
        <Welcome />
      )}
    </Flex>
  );
};

const MobileLayout = () => {
  const { menuState } = useContext(MenuContext);

  return (
    <Flex h="100%" w="100%" overflow="hidden">
      {menuState[menuState.active]?.conversationId || menuState[menuState.active]?.friendId ? (
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
