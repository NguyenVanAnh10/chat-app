import { useState, useRef, useEffect as useReactEffect } from "react";
import { io } from "socket.io-client";
import Peer from "simple-peer";

const CHAT_ROOM = 'CHAT_ROOM';

const socket = io(process.env.REACT_APP_BASE_API);
const useVideoChat = () => {
  const [stream, setStream] = useState(null);
  const [me, setMe] = useState({ name: "Name" });
  const [caller, setCaller] = useState({});
  const [callAccepted, setCallAccepted] = useState(false);
  const [callEnded, setCallEnded] = useState(false);

  const myVideo = useRef({});
  const remoteVideo = useRef({});
  const connectionRef = useRef();

  useReactEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((currentStream) => {
        setStream(currentStream);
        myVideo.current.srcObject = currentStream;
      })
      .catch((err) => {
        console.error("Failed to get local stream", err);
      });
    socket.on("me", (id) => {
      setMe({ ...me, id });
    });
    socket.on("callUser", ({ from, name, signal }) => {
      setCaller({ isReceivedCall: true, from, name, signal });
    });
    socket.on("callended", () => {
      console.log("callended end");
    });
  }, []);

  const answerCall = () => {
    setCallAccepted(true);
    const peer = new Peer({ initiator: false, trickle: false, stream });
    peer.on("signal", (data) => {
      socket.emit("answerCall", { signal: data, to: caller.from });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
    });

    peer.signal(caller.signal);
    connectionRef.current = peer;
  };

  const callUser = (id) => {
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
      stream,
    });
    peer.on("signal", (data) => {
      socket.emit("callUser", {
        userToCall: id,
        signal: data,
        from: me.id,
        name: me.name,
      });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideo.current.srcObject = remoteStream;
    });

    socket.on("callAccepted", (signal) => {
      setCallAccepted(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const leaveCall = () => {
    setCallEnded(true);
    connectionRef.current.destroy();
    window.location.reload();
  };

  return [
    {
      me,
      caller,
      callAccepted,
      callEnded,
      myVideo,
      remoteVideo,
      stream,
    },
    {
      callUser,
      leaveCall,
      answerCall,
      setMe,
    },
  ];
};

export const useMessageChat = () => {
  const [messages, setMessages] = useState([]);
  useReactEffect(() => {
    socket.on("message", ({ message }) => {
      console.log("messages messages");

      setMessages((messages) => [...messages, message]);
    });
  }, []);
  const onMessage = (message) => {
    setMessages([...messages, message]);
    socket.emit("message", { message });
  };
  return [
    {
      messages,
    },
    {
      onMessage,
    },
  ];
};

export default useVideoChat;
