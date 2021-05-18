import React, {
  useContext,
  useState,
  useEffect as useReactEffect,
} from "react";
import { VStack } from "@chakra-ui/react";

import { AccountContext } from "App";
import MessageList from "components/MessageList";
import MessageInput from "components/MessageInput";
import api from "services/api";

import styles from "./ChatBox.module.scss";

const ChatBox = () => {
  const { account, socket } = useContext(AccountContext);
  const [room, setRoom] = useState({});
  const [messages, setMessages] = useState([]);

  useReactEffect(() => {
    socket.on("create_room_chat_one_to_one_success", async ({ roomId }) => {
      if (!account._id) return;
      const roomRes = await api.GET(`/chat_rooms/${roomId}`, {
        userId: account._id,
      });
      if (roomRes.error) return;
      const messagesRes = await api.GET("/messages", {
        roomId,
        skip: 0,
        limit: 20,
      });
      if (messagesRes.error) return;
      setRoom(roomRes.room);
      setMessages(messagesRes.messages);
    });
  }, [account._id]);

  useReactEffect(() => {
    room._id &&
      api
        .GET("/messages", { roomId: room._id, skip: 0, limit: 20 })
        .then(({ messages: msgs }) => {
          setMessages(msgs);
        });
    socket.on("receive_message", async ({ roomId }) => {
      const messagesRes = await api.GET("/messages", {
        roomId,
        skip: 0,
        limit: 20,
      });
      if (messagesRes.error) return;
      setMessages(messagesRes.messages);
    });
    socket.on("send_message_success", async ({ roomId }) => {
      const messagesRes = await api.GET("/messages", {
        roomId,
        skip: 0,
        limit: 20,
      });
      if (messagesRes.error) return;
      setMessages(messagesRes.messages);
    });
  }, [room._id]);

  const onSendMessage = (contentMessage) => {
    socket.emit("send_message", {
      roomId: room._id,
      message: {
        sender: account.userName,
        content: contentMessage,
      },
    });
  };

  return (
    <VStack
      className={styles.ChatBox}
      flex="1"
      alignItems="flex-start"
      pl="3"
      justifyContent="space-between"
    >
      {room._id && (
        <>
          <MessageList className="show-message-box" messages={messages} />
          <MessageInput onSendMessage={onSendMessage} />
        </>
      )}
    </VStack>
  );
};
export default ChatBox;
