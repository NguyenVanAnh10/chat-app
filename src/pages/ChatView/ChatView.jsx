import React, {
  useContext,
  useEffect as useReactEffect,
  useState,
  createContext,
} from "react";
import {
  Box,
  Flex,
  Input,
  Text,
  Avatar,
  AvatarBadge,
  HStack,
  VStack,
  AvatarGroup,
  useBreakpointValue,
} from "@chakra-ui/react";
import classNames from "classnames";

import SubSideNav from "components/SubSideNav";
import { AccountContext } from "App";
import ChatBox from "components/ChatBox";
import useSocket from "socket";

import styles from "./ChatView.module.scss";
import { useModel } from "model";
import useRoom from "hooks/useRoom";

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
  useReactEffect(() => {
    account._id && socket.emit("join_all_room", { userId: account._id });
  }, [account._id]);

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

const MainSideNav = ({
  width,
  isMobileScreen,
  selectedRoomId,
  onSelectRoom,
}) => {
  return (
    <Flex
      flexDir="column"
      flex="1"
      p="2"
      bg="white"
      width={isMobileScreen ? "calc(100vw - 66px)" : 300}
      transition="width 0.3s ease"
    >
      <Flex
        alignItems="center"
        h="4rem"
        borderBottom="1px solid rgba(0, 0, 0, 0.08)"
      >
        <Input w="100%" placeholder="Search friend..." />
      </Flex>
      <UserMessageList
        selectedRoomId={selectedRoomId}
        onSelectRoom={onSelectRoom}
      />
    </Flex>
  );
};

const UserMessageList = ({ selectedRoomId, onSelectRoom }) => {
  const { account } = useContext(AccountContext);

  const [{ roomIds }, { getRooms }] = useModel(
    "message",
    ({ messages, getRooms }) => ({
      messages,
      roomIds: getRooms.ids || [],
    })
  );

  useReactEffect(() => {
    account._id && getRooms(account._id);
  }, [account._id]);

  // const onHandleClickRoom = (roomId) => {
  // TODO check existing room
  // const { socket } = useContext(SocketContext);
  // socket.emit("create_room_chat_one_to_one", {
  //   fromUser: account._id,
  //   toUser: room._id,
  // });
  // };

  return (
    <Box pt="5" className={styles.UserMessageList}>
      <Text fontSize="sm">All messages</Text>
      <VStack marginTop="5" alignItems="flex-start">
        {roomIds.map((roomId, _, arr) => (
          <RoomNav
            key={roomId}
            roomId={roomId}
            active={selectedRoomId === roomId}
            onClick={() => onSelectRoom(roomId)}
          />
        ))}
      </VStack>
    </Box>
  );
};
const RoomNav = ({ roomId, active, onClick }) => {
  const { account } = useContext(AccountContext);
  const [{ room }, { haveSeenNewMessages }] = useRoom(roomId);

  if (!room._id) return null;
  const onHandleClick = () => {
    onClick();
    if (!room.newMessageNumber) return;
    haveSeenNewMessages({ roomId: room._id, userId: account._id });
  };
  return (
    <HStack
      key={room._id}
      p="1"
      spacing="3"
      w="100%"
      borderRadius="5"
      cursor="pointer"
      className={classNames("item", {
        "selected-item": active,
      })}
      onClick={onHandleClick}
    >
      <AvatarGroup size="md" max={2}>
        {room.otherMembers.map((o) => (
          <Avatar key={o._id} name={o.userName}>
            <AvatarBadge boxSize="0.8em" bg="green.500" />
          </Avatar>
        ))}
      </AvatarGroup>
      <Text>{room.userName}</Text>
      {!!room.newMessageNumber && (
        <Text
          ml="auto !important"
          borderRadius="100%"
          bg="red.500"
          color="white"
          fontSize="sm"
          fontWeight="bold"
          width="5"
          height="5"
          textAlign="center"
        >
          {room.newMessageNumber}
        </Text>
      )}
    </HStack>
  );
};

export default ChatView;
