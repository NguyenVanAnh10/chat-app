import {
  useContext,
  useEffect as useReactEffect,
  useRef,
  useState,
} from 'react';
import { useBeforeUnload } from 'react-use';
import Peer from 'simple-peer';
import { v4 as uuid } from 'uuid';

import registerSocket from 'socket';
import { AccountContext } from 'App';
import { useModel } from 'model';
import Message from 'entities/Message';
import Notification from 'entities/Notification';
import { turnOnCameraAndAudio, stopStreame } from 'utils';

const initJoinAllRoomsState = {
  isJoined: false,
};

const useChat = () => {
  const { account } = useContext(AccountContext);
  const [,
    {
      getRoom, getMessage, getMessagesOtherUserHasSeen, sendMessage,
    },
  ] = useModel('message', () => ({}));
  const [, { getUser, getFriendRequest, updateOnline }] = useModel('account', () => ({}));

  const initChat = {
    roomId: '',
    caller: {},
    streamVideos: {}, // {current, remote}
    callState: {}, // {hasReceived, accepted, declined}
  };
  const [chat, setChat] = useState(initChat);

  const connectionRef = useRef();

  // TODO
  const [socket] = registerSocket({
    connect: () => {
      updateOnline({ id: account.id, online: true });
    },
    update_user: ({ userId }) => {
      getUser({ id: userId });
    },
    a_call_from: ({ signal, id, roomId }) => {
      if (id === account.id) return;
      setChat({
        ...initChat,
        roomId,
        caller: { signal, id },
        callState: { hasReceived: true },
      });
    },
    callended: () => {
      setChat(initChat);
      destroyCall();
    },
    decline_incoming_call: ({ callerId }) => {
      if (callerId === account.id) {
        destroyCall();
        setChat({ ...initChat, callState: { declined: true } });
      }
    },
    user_has_added_new_room: ({ roomId }) => {
      getRoom({ roomId, userId: account.id });
    },
    send_message_success: ({ senderId, messageId, roomId }) => {
      if (account.id === senderId) return;
      getMessage({
        messageId,
        userId: account.id,
        roomId,
        cachedKey: roomId });
    },
    user_has_seen_messages: ({ roomId, userId, haveSeenMessageIds }) => {
      if (account.id === userId) return;
      getMessagesOtherUserHasSeen({ roomId, userId, haveSeenMessageIds });
    },
    friend_request: ({ creatorId }) => {
      getFriendRequest({ userId: account.id, friendId: creatorId });
    },
    disconnect: () => {
      updateOnline({ id: account.id, online: false });
      console.log('disconnected');
    },
    error: ({ error }) => {
      console.error('error', error);
    },
  });

  useReactEffect(() => {
    if (initJoinAllRoomsState.isJoined || !account.id) return;
    socket.emit('join_all_room', { userId: account.id });
    initJoinAllRoomsState.isJoined = true;
    return () => {
      socket.disconnect();
    };
  }, [account.id]);

  useBeforeUnload(() => {
    console.log('before upload');
    updateOnline({ id: account.id, online: false });
  });

  const onAnswerCall = async () => {
    try {
      const currentStream = await turnOnCameraAndAudio();
      setChat({
        ...chat,
        streamVideos: { current: currentStream },
        callState: { hasReceived: false, accepted: true },
      });

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: currentStream,
      });
      peer.on('signal', signal => {
        socket.emit('answer_call', {
          roomId: chat.roomId,
          ...chat.caller,
          signal,
        });
      });

      peer.on('stream', remoteStream => {
        setChat(prev => ({
          ...prev,
          streamVideos: { ...prev.streamVideos, remote: remoteStream },
        }));
      });

      peer.signal(chat.caller.signal);
      // eslint-disable-next-line no-underscore-dangle
      peer._debug = console.log;
      connectionRef.current = peer;
    } catch (error) {
      console.error('Failed to get local stream', error);
    }
  };

  const onCallUser = async roomId => {
    try {
      const currentStream = await turnOnCameraAndAudio();
      setChat({ ...initChat, streamVideos: { current: currentStream } });
      const peer = new Peer({
        initiator: true,
        trickle: false,
        config: {
          iceServers: [
            {
              urls: process.env.REACT_APP_TUN_SERVER,
            },
            {
              urls: `${process.env.REACT_APP_TURN_SERVER}?transport=tcp`,
              username: 'anhnv',
              credential: 'rice',
            },
            {
              urls: `${process.env.REACT_APP_TURN_SERVER}?transport=udp`,
              username: 'anhnv',
              credential: 'rice',
            },
          ],
        },
        stream: currentStream,
      });
      peer.on('signal', signal => {
        socket.emit('call_to', {
          signal,
          id: account.id,
          roomId,
        });
      });

      peer.on('stream', remoteStream => {
        setChat(prev => ({
          ...prev,
          streamVideos: { ...prev.streamVideos, remote: remoteStream },
        }));
      });
      socket.removeAllListeners('call_accepted');
      socket.on('call_accepted', ({ signal }) => {
        setChat(prev => ({
          ...prev,
          callState: { accepted: true },
        }));
        peer.signal(signal);
      });
      // eslint-disable-next-line no-underscore-dangle
      peer._debug = console.log;
      connectionRef.current = peer;
    } catch (error) {
      console.error('Failed to get local stream', error);
    }
  };

  const onDeclineCall = callerId => {
    setChat({ ...chat, callState: { ...chat.callState, hasReceived: false } });
    socket.emit('decline_incoming_call', {
      callerId,
      roomId: chat.roomId,
    });
    sendMessage({
      roomId: chat.roomId,
      contentType: Message.CONTENT_TYPE_NOTIFICATION,
      content: Notification.NOTIFICATION_DECLINE_CALL,
      keyMsg: uuid(),
      createAt: Date.now(),
      senderId: account.id,
      usersSeenMessage: [account.id],
    });
  };

  const onLeaveCall = roomId => {
    destroyCall();
    setChat(initChat);
    socket.emit('callended', { userId: account.id, roomId });
    chat.callState.accepted
      && sendMessage({
        roomId,
        contentType: Message.CONTENT_TYPE_NOTIFICATION,
        content: Notification.NOTIFICATION_ENDED_CALL,
        keyMsg: uuid(),
        createAt: Date.now(),
        senderId: account.id,
        usersSeenMessage: [account.id],
      });
  };
  const destroyCall = () => {
    connectionRef.current?.destroy();
    stopStreame(chat.streamVideos.current);
  };

  return {
    state: {
      socket,
      ...chat,
    },
    actions: {
      onCallUser,
      onLeaveCall,
      onAnswerCall,
      onDeclineCall,
      turnOnCameraAndAudio,
    },
  };
};

export default useChat;
