import {
  useContext,
  useEffect as useReactEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";
import { v4 as uuid } from "uuid";

import useSocket from "socket";
import { AccountContext } from "App";
import { useModel } from "model";
import Message from "entities/Message";
import Notification from "entities/Notification";

const useVideoChat = (initRoomId, opts = { activeDevice: false }) => {
  const socket = useSocket();
  const { account } = useContext(AccountContext);

  const [roomId, setRoomId] = useState(initRoomId);
  const [caller, setCaller] = useState({});
  const [currentStreamVideo, setCurrentStreamVideo] = useState(null);
  const [remoteStreamVideo, setRemoteStreamVideo] = useState(null);
  const [hasReceivedACall, setHasReceivedACall] = useState(false);
  const [acceptedCall, setAcceptedCall] = useState();
  const [, { sendMessage }] = useModel("message", () => ({}));

  const currentStreamVideoRef = useRef();
  const connectionRef = useRef();

  useReactEffect(() => {
    opts.activeDevice &&
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          currentStreamVideoRef.current = currentStream;
          setCurrentStreamVideo(currentStream);
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });
  }, [opts.activeDevice]);

  useReactEffect(() => {
    socket.on("a_call_from", ({ signal, id, roomId: callerRoomId }) => {
      if (id === account._id) return;
      setHasReceivedACall(true);
      setCaller({ signal, id, roomId: callerRoomId });
      setRoomId(callerRoomId);
    });
    socket.on("callended", ({ userId }) => {
      if (userId === account._id) return;
      setHasReceivedACall(false);
      setRemoteStreamVideo(null);
      connectionRef.current?.destroy();
      stopStreamedVideo(currentStreamVideoRef.current);
      setAcceptedCall();
    });
    socket.on("decline_incoming_call", ({ callerId }) => {
      if (callerId === account._id) {
        connectionRef.current?.destroy();
        stopStreamedVideo(currentStreamVideoRef.current);
        setAcceptedCall(false);
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
    });
    return () => {
      socket.removeAllListeners("decline_incoming_call");
      socket.removeAllListeners("a_call_from");
      socket.removeAllListeners("callended");
    };
  }, []);

  const onAnswerCall = () => {
    if (!currentStreamVideo) return;
    setAcceptedCall(true);
    setHasReceivedACall(false);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentStreamVideo,
    });
    peer.on("signal", (signal) => {
      // if (signal.renegotiate || signal.transceiverRequest) return;
      socket.emit("answer_call", { ...caller, signal });
    });

    peer.on("stream", (remoteStream) => {
      setRemoteStreamVideo(remoteStream);
    });

    peer.signal(caller.signal);
    peer._debug = console.log;
    connectionRef.current = peer;
  };

  const onCallUser = () => {
    if (!currentStreamVideo) return;
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
      stream: currentStreamVideo,
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
      setRemoteStreamVideo(remoteStream);
    });
    socket.removeAllListeners("call_accepted");
    socket.on("call_accepted", ({ signal }) => {
      setAcceptedCall(true);
      peer.signal(signal);
    });
    peer._debug = console.log;
    connectionRef.current = peer;
  };

  const onDeclineCall = (callerId) => {
    socket.emit("decline_incoming_call", { callerId, roomId });
    setHasReceivedACall(false);
  };

  const onLeaveCall = () => {
    stopStreamedVideo(currentStreamVideo);
    setRemoteStreamVideo(null);
    socket.emit("callended", { userId: account._id, roomId });
    setAcceptedCall();
    connectionRef.current?.destroy();
    remoteStreamVideo &&
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

  const stopStreamedVideo = (stream) => {
    if (!stream) return;
    const tracks = stream.getTracks();

    tracks.forEach(function (track) {
      track.stop();
    });

    setCurrentStreamVideo(null);
  };

  return [
    {
      callerId: caller.id,
      currentVideo: currentStreamVideo,
      remoteVideo: remoteStreamVideo,
      hasReceivedACall,
      acceptedCall,
    },
    {
      onCallUser,
      onLeaveCall,
      onAnswerCall,
      onDeclineCall,
      setHasReceivedACall,
      setAcceptedCall,
    },
  ];
};

export default useVideoChat;
