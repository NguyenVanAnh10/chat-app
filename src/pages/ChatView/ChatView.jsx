import React, {
  useContext,
  useEffect as useReactEffect,
  useState,
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
} from "@chakra-ui/react";
import classNames from "classnames";

import api from "services/api";
import { AccountContext } from "App";

import styles from "./ChatView.module.scss";
import ChatBox from "components/ChatBox";

const ChatView = () => {
  const { account, socket } = useContext(AccountContext);
  const [users, setUsers] = useState([]);

  useReactEffect(() => {
    api.GET("/users").then((res) => {
      !res.error && setUsers(res);
    });
  }, []);

  useReactEffect(() => {
    socket.on("error", ({ error }) => {
      console.error("error", error);
    });
  }, []);

  useReactEffect(() => {
    account._id && socket.emit("join_all_room", { userId: account._id });
  }, [account._id]);

  return (
    <Flex className={styles.ChatView}>
      <Flex className="nav-bar">
        <Flex bg="red.100" p="2">
          <Avatar name={account.userName}>
            <AvatarBadge boxSize="0.8em" bg="green.500" />
          </Avatar>
        </Flex>
        <Flex flexDir="column" flex="1" p="2">
          <Flex
            alignItems="center"
            h="4rem"
            borderBottom="1px solid rgba(0, 0, 0, 0.08)"
          >
            <Input w="100%" placeholder="Search friend..." />
          </Flex>
          <UserMessageList friends={users} account={account} />
        </Flex>
      </Flex>
      <ChatBox />
    </Flex>
  );
};

const UserMessageList = ({ friends }) => {
  const { account, socket } = useContext(AccountContext);
  const [selectedFriend, setSelectedFriend] = useState({});

  // TODO list friend (initial chatting)
  const createChatRoom = (toUser) => {
    socket.emit("create_room_chat_one_to_one", {
      fromUser: account._id,
      toUser,
    });
  };

  return (
    <Box pt="5" className={styles.UserMessageList}>
      <Text fontSize="sm">All messages</Text>
      <VStack marginTop="5" alignItems="flex-start">
        {friends
          .filter((friend) => friend._id !== account._id)
          .map((friend, _, arr) => (
            <HStack
              key={friend._id}
              p="1"
              spacing="3"
              w="100%"
              borderRadius="5"
              cursor="pointer"
              className={classNames("item", {
                "selected-item": selectedFriend._id === friend._id,
              })}
              onClick={() => {
                setSelectedFriend(friend);
                createChatRoom(friend._id);
              }}
            >
              <Avatar name={friend.userName} size="md">
                <AvatarBadge boxSize="0.8em" bg="green.500" />
              </Avatar>
              <Text>{friend.userName}</Text>
            </HStack>
          ))}
      </VStack>
    </Box>
  );
};

export default ChatView;
