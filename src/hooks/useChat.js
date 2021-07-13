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

const useChat = () => {
  const { account } = useContext(AccountContext);
  const socketRef = useRef();
  const [,
    {
      getConversation, getMessage, getMessagesOtherUserHasSeen, sendMessage,
    },
  ] = useModel('message', () => ({}));
  const [, { getUser, getFriendRequest, updateOnline }] = useModel('account', () => ({}));

  const initChat = {
    conversationId: '',
    caller: {},
    streamVideos: {}, // {current, remote}
    callState: {}, // {hasReceived, accepted, declined}
  };
  const [chat, setChat] = useState(initChat);
  const chatRef = useRef();
  const connectionRef = useRef();

  useReactEffect(() => {
    chatRef.current = chat;
  }, [chat]);

  useReactEffect(() => {
    if (!account.id) return;
    const [socket] = registerSocket({
      connect: () => {
        updateOnline({ id: account.id, online: true });
      },
      update_user: ({ userId }) => {
        getUser({ id: userId });
      },
      a_call_from: ({ signal, id, conversationId }) => {
        if (id === account.id) return;
        setChat({
          ...initChat,
          conversationId,
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
      user_has_added_new_conversation: ({ conversationId }) => {
        getConversation({ conversationId, userId: account.id });
      },
      send_message_success: ({ senderId, messageId, conversationId }) => {
        if (account.id === senderId) return;
        getMessage({
          messageId,
          userId: account.id,
          conversationId,
          cachedKey: conversationId });
      },
      user_has_seen_messages: ({ conversationId, userId, haveSeenMessageIds }) => {
        if (account.id === userId) return;
        getMessagesOtherUserHasSeen({ conversationId, userId, haveSeenMessageIds });
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
    socket.emit('join_all_conversation', { userId: account.id });
    socketRef.current = socket;
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
        socketRef.current?.emit('answer_call', {
          conversationId: chat.conversationId,
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

  const onCallUser = async conversationId => {
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
        socketRef.current?.emit('call_to', {
          signal,
          id: account.id,
          conversationId,
        });
      });

      peer.on('stream', remoteStream => {
        setChat(prev => ({
          ...prev,
          streamVideos: { ...prev.streamVideos, remote: remoteStream },
        }));
      });
      socketRef.current?.removeAllListeners('call_accepted');
      socketRef.current?.on('call_accepted', ({ signal }) => {
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
    socketRef.current?.emit('decline_incoming_call', {
      callerId,
      conversationId: chat.conversationId,
    });
    sendMessage({
      conversationId: chat.conversationId,
      contentType: Message.CONTENT_TYPE_NOTIFICATION,
      content: Notification.NOTIFICATION_DECLINE_CALL,
      keyMsg: uuid(),
      createAt: Date.now(),
      senderId: account.id,
      usersSeenMessage: [account.id],
    });
  };

  const onLeaveCall = conversationId => {
    destroyCall();
    setChat(initChat);
    socketRef.current?.emit('callended', { userId: account.id, conversationId });
    chat.callState.accepted
      && sendMessage({
        conversationId,
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
    stopStreame(chatRef.current?.streamVideos?.current);
  };

  return {
    state: {
      socket: socketRef.current,
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
