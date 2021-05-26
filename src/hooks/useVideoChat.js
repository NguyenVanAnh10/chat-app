import {
  useContext,
  useEffect as useReactEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";

import { SocketContext } from "pages/ChatView";
import { AccountContext } from "App";

const useVideoChat = (room) => {
  const { socket } = useContext(SocketContext);
  const { account } = useContext(AccountContext);

  const [caller, setCaller] = useState({});
  const [hasReceivedACall, setHasReceivedACall] = useState(false);
  const [callAccepted, setCallAccepted] = useState(false);

  const currentVideo = useRef();
  const remoteVideo = useRef();
  const connectionRef = useRef();

  useReactEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        currentVideo.current = currentStream;
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });

    socket.on("a_call_from", ({ receiverId, signal, callerId, roomId }) => {
      setHasReceivedACall(true);
      setCaller({ receiverId, signal, callerId, roomId });
    });
    socket.on("callended", () => {
      console.log("callended end");
    });
  }, []);

  const onAnswerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentVideo.current,
    });
    peer.on("signal", (signal) => {
      socket.emit("answer_call", { ...caller, signal });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
    });

    peer.signal(caller.signal);
    connectionRef.current = peer;
  };

  const onCallUser = (receiverId) => {
    const peer = new Peer({
      initiator: true,
      trickle: false,
      config: {
        iceServers: [
          {
            url: "stun:stun.l.google.com:19302",
          },
          {
            url: "turn:numb.viagenie.ca",
            credential: "muazkh",
            username: "webrtc@live.com",
          },
        ],
      },
      stream: currentVideo.current,
    });
    peer.on("signal", (signal) => {
      socket.emit("call_to", {
        receiverId,
        signal,
        callerId: account._id,
        roomId: room._id,
      });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideo.current = remoteStream;
    });

    socket.on("call_accepted", ({ signal }) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const onLeaveCall = () => {
    connectionRef.current.destroy();
  };

  return [
    {
      currentVideo: currentVideo.current,
      remoteVideo: remoteVideo.current,
      hasReceivedACall,
      callAccepted,
    },
    {
      onCallUser,
      onLeaveCall,
      onAnswerCall,
    },
  ];
};

export default useVideoChat;
