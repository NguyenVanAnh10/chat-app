import {
  useContext,
  useEffect as useReactEffect,
  useMemo,
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
  const [,
    {
      getUnseenMessages, getMessagesWithoutLoading, sendMessage, getMessage,
    },
  ] = useModel('message', () => ({}));
  const [, { getConversation }] = useModel('conversation', () => ({}));
  const [, { getFriendRequester, updateOnline, getFriend }] = useModel('account', () => ({}));
  const [, { getUser }] = useModel('user', () => ({}));
  const initChat = {
    conversationId: '',
    caller: {},
    streamVideos: {}, // {current, remote}
    callState: {}, // {hasReceived, accepted, declined, isOutgoing}
  };
  const [chat, setChat] = useState(initChat);
  const chatRef = useRef();
  const connectionRef = useRef();

  const [socket] = useMemo(() => {
    if (!account.id) return [];
    return registerSocket({
      connect: () => {
        socket.emit('join_all_conversations', { userId: account.id });
        updateOnline({ online: true });
      },
      update_user: ({ userId }) => {
        getUser({ id: userId });
      },
      have_a_coming_call: ({ signal, callerId, conversationId }) => {
        if (callerId === account.id) return;

        if (chatRef.current.streamVideos.remote) {
          declineCall({ callerId, conversationId });
          return;
        }
        if (chatRef.current.callState.accepted || chatRef.current.callState.isOutgoing) {
          return;
        }
        setChat({
          ...initChat,
          conversationId,
          caller: { signal, id: callerId },
          callState: { hasReceived: true },
        });
      },
      end_call: ({ userId }) => {
        if (userId === account.id) return;
        setChat(initChat);
        destroyCall();
      },
      decline_the_incoming_call: ({ callerId }) => {
        if (callerId === account.id) {
          destroyCall();
          setChat({ ...initChat, callState: { declined: true } });
        }
      },
      add_new_conversation: ({ conversationId }) => {
        getConversation({ id: conversationId });
      },
      get_message: ({ senderId, messageId, conversationId, messageContentType }) => {
        if (account.id === senderId && messageContentType !== Message.CONTENT_TYPE_NOTIFICATION) {
          return;
        }
        getMessage({ cachedKey: conversationId, conversationId, messageId });
        getUnseenMessages({ cachedKey: conversationId, conversationId });
        getUnseenMessages({ cachedKey: 'all' });
      },
      seen_messages: ({ conversationId, seenUserId, messageIds }) => {
        if (account.id === seenUserId) return;
        getMessagesWithoutLoading({ cachedKey: conversationId, conversationId, messageIds });
      },
      get_new_friend_request: () => {
        getFriendRequester();
      },
      accept_friend_request: ({ friendId }) => {
        getFriend(friendId);
      },
      disconnect: () => {
        updateOnline({ online: false });
      },
      error: ({ error }) => {
        console.error('error', error);
      },
    });
  }, [account.id]);

  useReactEffect(() => {
    chatRef.current = chat;
  }, [chat]);

  useBeforeUnload(() => {
    console.log('before upload');
    updateOnline({ online: false });
  });

  const onAcceptCall = () => {
    setChat({
      ...chat,
      callState: { hasReceived: false, accepted: true },
    });
  };

  const onAnswerCall = async ({ remoteSignal, conversationId }) => {
    try {
      const currentStream = await turnOnCameraAndAudio();
      setChat({
        ...chat,
        streamVideos: { current: currentStream },
        callState: { accepted: true },
      });

      const peer = new Peer({
        initiator: false,
        trickle: false,
        stream: currentStream,
      });
      peer.on('signal', signal => {
        socket?.emit('answer_the_call', {
          conversationId,
          signal,
        });
      });

      peer.on('stream', remoteStream => {
        setChat(prev => ({
          ...prev,
          streamVideos: { ...prev.streamVideos, remote: remoteStream },
        }));
      });

      peer.signal(remoteSignal);
      // eslint-disable-next-line no-underscore-dangle
      peer._debug = console.log;
      connectionRef.current = peer;
    } catch (error) {
      console.error('Failed to get local stream', error);
    }
  };

  const onOutgoingCall = conversationId => {
    if (chat.callState.accepted || chat.callState.isOutgoing) {
      leaveCall(chat.conversationId);
    }
    setChat({
      ...chat,
      conversationId,
      callState: { isOutgoing: true },
    });
  };
  const onCallFriend = async ({ conversationId, addresseeIds }) => {
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
              username: process.env.REACT_APP_USER_TURN,
              credential: process.env.REACT_APP_PASSWORD_TURN,
            },
            {
              urls: `${process.env.REACT_APP_TURN_SERVER}?transport=udp`,
              username: process.env.REACT_APP_USER_TURN,
              credential: process.env.REACT_APP_PASSWORD_TURN,
            },
          ],
        },
        stream: currentStream,
      });
      peer.on('signal', signal => {
        socket?.emit('call_to', {
          signal,
          callerId: account.id,
          conversationId,
          addresseeIds,
        });
      });

      peer.on('stream', remoteStream => {
        setChat(prev => ({
          ...prev,
          streamVideos: { ...prev.streamVideos, remote: remoteStream },
        }));
      });
      socket?.removeAllListeners('accept_the_call');
      socket?.on('accept_the_call', ({ signal }) => {
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
    declineCall({ callerId, conversationId: chat.conversationId });
  };

  const onLeaveCall = conversationId => {
    setChat(initChat);
    leaveCall(conversationId);
  };

  const leaveCall = conversationId => {
    destroyCall();
    socket?.emit('end_call', { userId: account.id, conversationId });
    chat.callState.accepted
      && sendMessage({
        conversationId,
        contentType: Message.CONTENT_TYPE_NOTIFICATION,
        content: Notification.NOTIFICATION_ENDED_CALL,
        keyMsg: uuid(),
        createAt: Date.now(),
        sender: account.id,
      });
  };

  const declineCall = ({ callerId, conversationId }) => {
    socket?.emit('decline_the_incoming_call', {
      callerId,
      conversationId,
    });
    sendMessage({
      conversationId,
      contentType: Message.CONTENT_TYPE_NOTIFICATION,
      content: Notification.NOTIFICATION_DECLINE_CALL,
      keyMsg: uuid(),
      createAt: Date.now(),
      sender: account.id,
    });
  };

  const destroyCall = () => {
    connectionRef.current?.destroy();
    stopStreame(chatRef.current?.streamVideos?.current);
  };

  return [
    {
      socket,
      ...chat,
    },
    {
      onOutgoingCall,
      onCallFriend,
      onLeaveCall,
      onAnswerCall,
      onAcceptCall,
      onDeclineCall,
      turnOnCameraAndAudio,
    },
  ];
};

export default useChat;
