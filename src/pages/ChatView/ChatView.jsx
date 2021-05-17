import React, {
  useContext,
  useEffect as useReactEffect,
  useState,
} from "react";
import {
  Box,
  Button,
  Flex,
  Input,
  Text,
  Avatar,
  AvatarBadge,
  HStack,
  VStack,
} from "@chakra-ui/react";
import { useForm, Controller } from "react-hook-form";
import { io } from "socket.io-client";

import api from "services/api";
import { AccountContext } from "App";

import styles from "./ChatView.module.scss";

const socket = io(process.env.REACT_APP_HEROKU_API);

const ChatView = () => {
  const { account } = useContext(AccountContext);
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
      <RoomList users={users} />
    </Flex>
  );
};

const UserMessageList = ({ friends, account }) => {
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
              className="item selected-item "
              background={selectedFriend._id === friend._id ? "blue.400" : ""}
            >
              <Avatar
                name={friend.userName}
                size="md"
                onClick={() => {
                  setSelectedFriend(friend);
                  createChatRoom(friend._id);
                }}
              >
                <AvatarBadge boxSize="0.8em" bg="green.500" />
              </Avatar>
              <Text>{friend.userName}</Text>
            </HStack>
          ))}
      </VStack>
    </Box>
  );
};

const RoomList = ({ users }) => {
  const [rooms, setRooms] = useState([]);
  const { account } = useContext(AccountContext);

  useReactEffect(() => {
    socket.on("joined_room_success", ({ roomId }) => {
      account._id &&
        api.GET("/chat_rooms", { userId: account._id }).then((res) => {
          !res.error && setRooms(res.chatRooms);
        });
    });
    socket.on("create_room_chat_one_to_one_success", ({ roomId }) => {
      account._id &&
        api.GET("/chat_rooms", { userId: account._id }).then((res) => {
          !res.error && setRooms(res.chatRooms);
        });
    });

    account._id &&
      api.GET("/chat_rooms", { userId: account._id }).then((res) => {
        !res.error && setRooms(res.chatRooms);
      });
  }, [account._id]);
  const handleSendMessage = (room, msg) => {
    socket.emit("send_message", {
      roomId: room._id,
      message: {
        sender: account.userName,
        content: msg,
      },
    });
  };

  return (
    <>
      {rooms.map((room) => (
        <ChatBox
          key={room._id}
          room={room}
          account={account}
          sendMessage={(msg) => handleSendMessage(room, msg)}
        />
      ))}
    </>
  );
};

const ChatBox = ({ room, account, sendMessage }) => {
  const { control, handleSubmit, reset } = useForm({ message: "" });
  const [messages, setMessages] = useState([]);

  useReactEffect(() => {
    api
      .GET("/messages", { roomId: room._id, skip: 0, limit: 3 })
      .then(({ messages: msgs }) => {
        setMessages(msgs);
      });
    socket.on("receive_message", ({ roomId }) => {
      api
        .GET("/messages", { roomId, skip: 0, limit: 20 })
        .then(({ messages: msgs }) => {
          setMessages(msgs);
        });
    });
    socket.on("send_message_success", ({ roomId }) => {
      api
        .GET("/messages", { roomId, skip: 0, limit: 20 })
        .then(({ messages: msgs }) => {
          setMessages(msgs);
        });
    });
  }, []);

  const handleSubmitMessage = handleSubmit((data) => {
    sendMessage(data.message);
    reset({ message: "" });
  });
  console.log(messages, account);
  return (
    <VStack
      className={styles.ChatBox}
      flex="1"
      alignItems="flex-start"
      pl="5"
      justifyContent="space-between"
    >
      <Flex flexDir="column" mt="5" w="100%" className="show-message-box">
        {messages.map((m) => (
          <HStack
            w="100%"
            key={m._id}
            flexDir={m.sender === account.userName ? "row" : "row-reverse"}
          >
            <Avatar
              name={m.sender}
              size="sm"
              zIndex="2"
              bottom="-10px"
            ></Avatar>
            <Text
              className={`message ${
                m.sender === account.userName ? "receive" : "send"
              }`}
              zIndex="1"
            >
              {m.content}
            </Text>
          </HStack>
        ))}
      </Flex>
      <Flex mt="3" width="100%" className="type-box">
        <form className="form" onSubmit={handleSubmitMessage}>
          <Controller
            name="message"
            control={control}
            defaultValue=""
            render={({ field }) => <Input placeholder="User name" {...field} />}
          />
        </form>
        <Button background="red.100" ml="3" onClick={handleSubmitMessage}>
          Send
        </Button>
      </Flex>
    </VStack>
  );
};

export default ChatView;
