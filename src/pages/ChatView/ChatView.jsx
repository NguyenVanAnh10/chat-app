import React, {
  useContext,
  useEffect as useReactEffect,
  useState,
  createContext,
} from "react";
import { Flex, useBreakpointValue, useDisclosure } from "@chakra-ui/react";
import classNames from "classnames";

import { AccountContext } from "App";
import { useModel } from "model";
import SubSideNav from "components/SubSideNav";
import ChatBox from "components/ChatBox";
import MainSideNav from "layouts/ChatView/MainSideNav";

import styles from "./ChatView.module.scss";
import useChat from "hooks/useChat";
import CallingAlertModal from "components/CallingAlertModal";
import VideoCallModal from "components/VideoCallModal";

export const ChatContext = createContext({});

const ChatView = () => {
  const { account } = useContext(AccountContext);
  const [, { getMessages }] = useModel("message", () => ({}));
  const [selectedRoomId, setSelectedRoomId] = useState();
  const [showMainSideNav, setShowMainSideNav] = useState(true);
  const { isOpen, onClose, onOpen: onOpenConversationModal } = useDisclosure();
  const isMobileScreen = useBreakpointValue({ base: true, md: false });
  const { state: chatState, actions: chatActions } = useChat();

  const { caller, callState } = chatState;
  const { onDeclineCall, setCallState, onAnswerCall } = chatActions;

  useReactEffect(() => {
    getMessages({ userId: account._id });
  }, []);
  return (
    <ChatContext.Provider value={{ state: chatState, actions: chatActions }}>
      <Flex className={styles.ChatView}>
        <Flex className="nav-bar">
          <SubSideNav
            isActive={showMainSideNav || !isMobileScreen}
            onShowMainSideNav={() =>
              isMobileScreen && setShowMainSideNav(!showMainSideNav)
            }
          />
          {(showMainSideNav || !isMobileScreen) && (
            <MainSideNav
              isMobileScreen={isMobileScreen}
              selectedRoomId={selectedRoomId}
              onSelectRoom={(id) => {
                setSelectedRoomId(id);
                setShowMainSideNav(false);
              }}
            />
          )}
        </Flex>
        {selectedRoomId && (
          <Flex
            width={isMobileScreen ? "calc(100vw - 66px)" : "100%"}
            className={classNames({
              "main-content-mobile-screen": isMobileScreen,
            })}
          >
            <ChatBox roomId={selectedRoomId} />
          </Flex>
        )}
      </Flex>
      <CallingAlertModal
        callerId={caller.id}
        isOpen={callState.hasReceived}
        onDecline={() => onDeclineCall(caller.id)}
        onAnswer={() => {
          onOpenConversationModal();
          setCallState({ hasReceived: false, accepted: true });
          onAnswerCall();
        }}
      />
      <VideoCallModal isOpen={isOpen} onClose={onClose} />
    </ChatContext.Provider>
  );
};

export default ChatView;
