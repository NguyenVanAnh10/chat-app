import {
  useContext,
  useEffect as useReactEffect,
  useRef,
  useState,
} from "react";
import Peer from "simple-peer";

import useSocket from "socket";
import { AccountContext } from "App";

const useVideoChat = (room, opts = { activeDevice: false }) => {
  const socket = useSocket();
  const { account } = useContext(AccountContext);

  const [caller, setCaller] = useState({});
  const [currentStreamVideo, setCurrentStreamVideo] = useState();
  const [remoteStreamVideo, setRemoteStreamVideo] = useState();

  const [hasReceivedACall, setHasReceivedACall] = useState(false);
  const [acceptedCall, setAcceptedCall] = useState(false);

  const currentStreamVideoRef = useRef();
  const remoteVideo = useRef();
  const connectionRef = useRef();

  useReactEffect(() => {
    opts.activeDevice &&
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((currentStream) => {
          setCurrentStreamVideo(currentStream);
          currentStreamVideoRef.current = currentStream;
        })
        .catch((err) => {
          console.error("Failed to get local stream", err);
        });

    socket.on("a_call_from", ({ signal, id, roomId }) => {
      if (id === account._id) return;
      setHasReceivedACall(true);
      setCaller({ signal, id, roomId });
    });
    socket.on("callended", () => {
      console.log("callended end");
    });
  }, [opts.activeDevice]);

  const onAnswerCall = () => {
    setAcceptedCall(true);
    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: currentStreamVideoRef.current,
    });
    peer.on("signal", (signal) => {
      socket.emit("answer_call", { ...caller, signal });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideo.current = remoteStream;
      setRemoteStreamVideo(remoteStream);
    });

    peer.signal(caller.signal);
    connectionRef.current = peer;
  };

  const onCallUser = () => {
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
      stream: currentStreamVideoRef.current,
    });
    peer.on("signal", (signal) => {
      socket.emit("call_to", {
        signal,
        id: account._id,
        roomId: room._id,
      });
    });

    peer.on("stream", (remoteStream) => {
      remoteVideo.current = remoteStream;
      setRemoteStreamVideo(remoteStream);
    });

    socket.on("call_accepted", ({ signal }) => {
      setAcceptedCall(true);
      peer.signal(signal);
    });
    connectionRef.current = peer;
  };

  const onDeclineCall = () => setHasReceivedACall(false);

  const onLeaveCall = () => {
    // connectionRef.current.destroy();
    stopStreamedVideo(currentStreamVideoRef.current);
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
    },
  ];
};

export default useVideoChat;
