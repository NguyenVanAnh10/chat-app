import { useContext, useEffect as useReactEffect } from "react";
import { useModel } from "model";
import { io } from "socket.io-client";
import { AccountContext } from "App";

const socketControler = {
  initSocket: function () {
    this.socket = io(process.env.REACT_APP_HEROKU_API);
  },
};

const useSocket = () => {
  const { account } = useContext(AccountContext);
  const [, { getMessages, getRoom, getMessage, getHaveSeenNewMessages }] =
    useModel("message", () => ({}));

  if (!socketControler.socket) {
    socketControler.initSocket();
  }

  const sendMessageSuccessListener = ({ senderId, messageId, roomId }) => {
    if (account._id === senderId) return;
    getMessage({ messageId, userId: account._id, roomId });
  };
  const receiveMessageListener = ({ roomId }) => {
    getMessages({ roomId, userId: account._id });
  };
  const userHasSeenNewMessages = ({ roomId, userId, haveSeenMessageIds }) => {
    if (account._id === userId) return;
    getHaveSeenNewMessages({ roomId, userId, haveSeenMessageIds });
  };
  //   TODO account._id
  const getRoomListener = ({ roomId }) => {
    getRoom({ roomId, userId: account?._id });
  };
  const getNewRoom = ({ roomId, createrId }) => {
    // TODO other peer (include person created room) auto getRoom once create room successful
    // if (account._id !== createrId) return;
    getRoom({ roomId, userId: account?._id });
  };
  const errorListener = ({ error }) => {
    console.error("error", error);
  };

  useReactEffect(() => {
    account._id &&
      socketControler.socket.emit("join_all_room", { userId: account._id });
    socketControler.socket.on(
      "create_room_chat_one_to_one_success",
      getRoomListener
    );
    socketControler.socket.on("user_has_added_new_room", getNewRoom);
    socketControler.socket.on(
      "send_message_success",
      sendMessageSuccessListener
    );
    socketControler.socket.on("receive_message", receiveMessageListener);
    socketControler.socket.on("user_has_seen_messages", userHasSeenNewMessages);
    socketControler.socket.on("error", errorListener);
    return () => {
      socketControler.socket.off(
        "create_room_chat_one_to_one_success",
        getRoomListener
      );
      socketControler.socket.off(
        "send_message_success",
        sendMessageSuccessListener
      );
      socketControler.socket.off("receive_message", receiveMessageListener);
      socketControler.socket.off("error", errorListener);
    };
  }, [account]);
  return socketControler.socket;
};

export default useSocket;
