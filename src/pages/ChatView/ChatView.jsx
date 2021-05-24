import React, {
  useContext,
  useEffect as useReactEffect,
  useState,
  createContext,
} from "react";
import { Flex, useBreakpointValue } from "@chakra-ui/react";
import classNames from "classnames";

import { AccountContext } from "App";
import useSocket from "socket";
import { useModel } from "model";
import SubSideNav from "components/SubSideNav";
import ChatBox from "components/ChatBox";
import MainSideNav from "layouts/ChatView/MainSideNav";

import styles from "./ChatView.module.scss";

export const SocketContext = createContext({});

const ChatView = () => {
  const { account } = useContext(AccountContext);
  const [, { getMessages }] = useModel("message", () => ({}));
  const [selectedRoomId, setSelectedRoomId] = useState();
  const [showMainSideNav, setShowMainSideNav] = useState(true);
  const isMobileScreen = useBreakpointValue({ base: true, md: false });

  const socket = useSocket();
  useReactEffect(() => {
    getMessages({ userId: account._id });
  }, []);

  return (
    <SocketContext.Provider value={{ socket }}>
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
    </SocketContext.Provider>
  );
};

export default ChatView;
