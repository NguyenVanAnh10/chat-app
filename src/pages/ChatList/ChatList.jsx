import React, {
  useContext,
  useEffect as useReactEffect,
  useState,
  createContext,
} from "react";
import { Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";

import { AccountContext } from "App";
import { useModel } from "model";
import SubSideNav from "components/SubSideNav";
import ChatBox from "components/ChatBox";
import MainSideNav from "layouts/ChatList/MainSideNav";

import useChat from "hooks/useChat";
import CallingAlertModal from "components/CallingAlertModal";
import VideoCallModal from "components/VideoCallModal";

export const ChatContext = createContext({});

const ChatList = () => {
  const { account } = useContext(AccountContext);
  const [, { getMessages }] = useModel("message", () => ({}));
  const [selectedRoomId, setSelectedRoomId] = useState();
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
      {!isMobileScreen ? (
        <MainLayout
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      ) : (
        <MobileLayout
          selectedRoomId={selectedRoomId}
          setSelectedRoomId={setSelectedRoomId}
        />
      )}
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

const MainLayout = ({ selectedRoomId, setSelectedRoomId, children }) => {
  return (
    <Flex minH="100vh" w="100%">
      <Flex borderRight="1px solid rgba(0, 0, 0, 0.08)">
        <SubSideNav />
        <MainSideNav
          selectedRoomId={selectedRoomId}
          onSelectRoomId={(roomId) => setSelectedRoomId(roomId)}
        />
      </Flex>
      <ChatBox roomId={selectedRoomId} />
    </Flex>
  );
};

const MobileLayout = ({ selectedRoomId, setSelectedRoomId }) => {
  const { isOpen, onClose, onOpen } = useDisclosure();
  return (
    <Flex w="100%">
      {!isOpen ? (
        <MainSideNav
          selectedRoomId={selectedRoomId}
          onSelectRoomId={(roomId) => {
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
export default ChatList;
