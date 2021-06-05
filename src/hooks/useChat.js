import {
  useContext,
  useEffect as useReactEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";
import { v4 as uuid } from "uuid";

import { registerSocket } from "socket";
import { AccountContext } from "App";
import { useModel } from "model";
import Message from "entities/Message";
import Notification from "entities/Notification";
import { turnOnCameraAndAudio, stopStreame } from "utils";

const useChat = () => {
  const { account } = useContext(AccountContext);
  const [
    ,
    { getMessages, getRoom, getMessage, getHaveSeenNewMessages, sendMessage },
  ] = useModel("message", () => ({}));

  const [caller, setCaller] = useState({}); // caller, roomId
  const [streamVideos, setStreamVideos] = useState({}); // {current, remote}
  const [callState, setCallState] = useState({}); // {hasReceived, accepted, declined}

  const connectionRef = useRef();

  const [socket] = registerSocket({
    a_call_from: ({ signal, id, roomId }) => {
      if (id === account._id) return;
      setCallState({ hasReceived: true });
      setCaller({ signal, id, roomId });
    },
    callended: () => {
      setCallState({});
      setStreamVideos({});
      destroyCall();
    },
    decline_incoming_call: ({ callerId, roomId }) => {
      destroyCall();
      if (callerId === account._id) {
        setCallState({ declined: true });
        sendMessage({
          roomId,
          contentType: Message.CONTENT_TYPE_NOTIFICATION,
          content: Notification.NOTIFICATION_DECLINE_CALL,
          keyMsg: uuid(),
          createAt: Date.now(),
          senderId: account._id,
          hadSeenMessageUsers: [account._id],
        });
      }
    },
    create_room_chat_one_to_one_success: ({ roomId }) => {
      getRoom({ roomId, userId: account._id });
    },
    user_has_added_new_room: ({ roomId, createrId }) => {
      // TODO other peer (include person created room) auto getRoom once create room successful
      // if (account._id !== createrId) return;
      getRoom({ roomId, userId: account._id });
    },
    send_message_success: ({ senderId, messageId, roomId }) => {
      if (account._id === senderId) return;
      getMessage({ messageId, userId: account._id, roomId });
    },
    receive_message: ({ roomId }) => {
      getMessages({ roomId, userId: account._id });
    },
    user_has_seen_messages: ({ roomId, userId, haveSeenMessageIds }) => {
      if (account._id === userId) return;
      getHaveSeenNewMessages({ roomId, userId, haveSeenMessageIds });
    },
    disconnect_socket: () => {
      console.log("disconnect_socket");
    },
    error: ({ error }) => {
      console.error("error", error);
    },
  });

  useReactEffect(() => {
    socket.emit("join_all_room", { userId: account._id });
    return () => {
      socket.disconnect();
    };
  }, []);

  const onAnswerCall = async () => {
    try {
      const currentStream = await turnOnCameraAndAudio();
      setStreamVideos({ current: currentStream });

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: currentStream,
      });
      peer.on("signal", (signal) => {
        socket.emit("answer_call", { ...caller, signal });
      });

      peer.on("stream", (remoteStream) => {
        setStreamVideos((prev) => ({ ...prev, remote: remoteStream }));
      });

      peer.signal(caller.signal);
      peer._debug = console.log;
      connectionRef.current = peer;
    } catch (error) {
      console.error("Failed to get local stream", error);
    }
  };

  const onCallUser = async (roomId) => {
    try {
      const currentStream = await turnOnCameraAndAudio();
      setStreamVideos({ current: currentStream });
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: "stun:stun.fbsbx.com:3478",
            },
            {
              urls: "turn:54.169.254.47:3478?transport=tcp",
              username: "anhnv",
              credential: "rice",
            },
            {
              urls: "turn:54.169.254.47:3478?transport=udp",
              username: "anhnv",
              credential: "rice",
            },
          ],
        },
        stream: currentStream,
      });
      peer.on("signal", (signal) => {
        // if (signal.renegotiate || signal.transceiverRequest) return;
        socket.emit("call_to", {
          signal,
          id: account._id,
          roomId,
        });
      });

      peer.on("stream", (remoteStream) => {
        setStreamVideos((prev) => ({ ...prev, remote: remoteStream }));
      });
      socket.removeAllListeners("call_accepted");
      socket.on("call_accepted", ({ signal }) => {
        setCallState({ accepted: true });
        peer.signal(signal);
      });
      peer._debug = console.log;
      connectionRef.current = peer;
    } catch (error) {
      console.error("Failed to get local stream", error);
    }
  };

  const onDeclineCall = (callerId) => {
    setCallState({ ...callState, hasReceived: false });
    socket.emit("decline_incoming_call", {
      callerId,
      roomId: caller.roomId,
    });
  };

  const onLeaveCall = (roomId) => {
    setStreamVideos({});
    setCallState({});
    destroyCall();
    socket.emit("callended", { userId: account._id, roomId });
    streamVideos.remote &&
      sendMessage({
        roomId,
        contentType: Message.CONTENT_TYPE_NOTIFICATION,
        content: Notification.NOTIFICATION_ENDED_CALL,
        keyMsg: uuid(),
        createAt: Date.now(),
        senderId: account._id,
        hadSeenMessageUsers: [account._id],
      });
  };
  const destroyCall = () => {
    connectionRef.current?.destroy();
    stopStreame(streamVideos.current);
  };

  return {
    state: {
      socket,
      caller,
      callState, // {hasReceived, accepted, declined}
      streamVideos, // {current, stream}
    },
    actions: {
      onCallUser,
      onLeaveCall,
      onAnswerCall,
      onDeclineCall,
      setCallState,
      turnOnCameraAndAudio,
    },
  };
};

export default useChat;
