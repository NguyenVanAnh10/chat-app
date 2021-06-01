import {
  useContext,
  useEffect as useReactEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";

import useSocket from "socket";
import { AccountContext } from "App";

const useVideoChat = (initRoomId, opts = { activeDevice: false }) => {
  const socket = useSocket();
  const { account } = useContext(AccountContext);

  const [roomId, setRoomId] = useState(initRoomId);
  const [caller, setCaller] = useState({});
  const [currentStreamVideo, setCurrentStreamVideo] = useState(null);
  const [remoteStreamVideo, setRemoteStreamVideo] = useState(null);

  const [hasReceivedACall, setHasReceivedACall] = useState(false);
  const [acceptedCall, setAcceptedCall] = useState(false);

  const currentStreamVideoRef = useRef({});
  const remoteStreamVideoRef = useRef({});
  const connectionRef = useRef();

  useReactEffect(() => {
    opts.activeDevice &&
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          currentStreamVideoRef.current.srcObject = currentStream;
          setCurrentStreamVideo(currentStream);
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });

    socket.on("a_call_from", callFromListener);
    socket.on("callended", callEndedListener);

    return () => {
      socket.off("a_call_from", callFromListener);
      socket.off("callended", callEndedListener);
    };
  }, [opts.activeDevice]);

  const callEndedListener = ({ userId }) => {
    if (userId === account._id) return;
    setRemoteStreamVideo(null);
    connectionRef.current?.destroy();
    stopStreamedVideo(currentStreamVideoRef.current.srcObject);
  };

  const callFromListener = ({ signal, id, roomId: callerRoomId }) => {
    if (id === account._id) return;
    setHasReceivedACall(true);
    setCaller({ signal, id, roomId: callerRoomId });
    setRoomId(callerRoomId);
  };

  const onAnswerCall = () => {
    setAcceptedCall(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentStreamVideoRef.current.srcObject,
    });
    peer.on("signal", (signal) => {
      // if (signal.renegotiate || signal.transceiverRequest) return;
      socket.emit("answer_call", { ...caller, signal });
    });

    peer.on("stream", (remoteStream) => {
      remoteStreamVideoRef.current.srcObject = remoteStream;
      setRemoteStreamVideo(remoteStream);
    });

    peer.signal(caller.signal);
    peer._debug = console.log;
    connectionRef.current = peer;
  };

  const onCallUser = () => {
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
      stream: currentStreamVideoRef.current.srcObject,
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
      remoteStreamVideoRef.current.srcObject = remoteStream;
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

  const onDeclineCall = () => setHasReceivedACall(false);

  const onLeaveCall = () => {
    if (!remoteStreamVideo) return;
    setRemoteStreamVideo(null);
    socket.emit("callended", { userId: account._id, roomId });
    connectionRef.current?.destroy();
    stopStreamedVideo(currentStreamVideoRef.current.srcObject);
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
      currentStreamVideoRef,
      remoteStreamVideoRef,
      hasReceivedACall,
      acceptedCall,
    },
    {
      onCallUser,
      onLeaveCall,
      onAnswerCall,
      onDeclineCall,
    },
  ];
};

export default useVideoChat;
