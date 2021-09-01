import { useContext, useEffect, useState } from 'react';
import { io } from 'socket.io-client';

import { AccountContext } from 'App';
import { useModel } from 'model';
import Message from 'entities/Message';
import { declineCall, destroyCall } from 'entities/SocketHandler';
import ChatAction from 'actions/Chat';

const registerSocket = (events = {}) => {
  const socket = io(process.env.REACT_APP_BACKEND_API || '/', {
    path: '/api/v1/socket/',
  });

  Object.keys(events).forEach(eventName => {
    socket.removeAllListeners(eventName);
    socket.on(eventName, events[eventName]);
  });
  const unSubscribe = (eventNames = []) => {
    eventNames
      .filter(evtName => Object.keys(events).includes(evtName))
      .forEach(evtName => socket.removeAllListeners(evtName));
  };

  return [socket, unSubscribe];
};

const useSocket = ({ peers, chat, dispatch }) => {
  const [socketState, setSocket] = useState();
  const { account } = useContext(AccountContext);
  const [, { getUnseenMessages, getMessagesWithoutLoading, getMessage }] = useModel(
    'message',
    () => ({}),
  );
  const [, { getConversation }] = useModel('conversation', () => ({}));
  const [, { getFriendRequester, updateOnline, getFriend }] = useModel('account', () => ({}));
  const [, { getUser }] = useModel('user', () => ({}));
  const [, { sendMessage }] = useModel('message', () => ({}));

  useEffect(() => {
    const events = {
      connect: () => {
        socket.emit('join_all_conversations', { userId: account.id });
        updateOnline({ online: true });
      },
      update_user: ({ userId }) => {
        getUser({ id: userId });
      },
      have_a_coming_call: ({ signal, callerId, conversationId }) => {
        if (callerId === account.id) return;

        if (chat.streamVideos.remote) {
          // busy line
          declineCall({
            callerId,
            conversationId,
            sendMessage,
            socket,
            account,
          });
          return;
        }
        if (chat.callState.accepted || chat.callState.isOutgoing) {
          return;
        }
        dispatch(
          ChatAction.haveAComingCall({
            conversationId,
            caller: { id: callerId },
          }),
        );
        localStorage.setItem('remoteSignals', JSON.stringify({ [callerId]: signal }));
      },
      end_call: () => {
        dispatch(ChatAction.endCall());
        destroyCall({ peers });
      },
      decline_the_incoming_call: ({ callerId }) => {
        if (callerId === account.id) {
          destroyCall();
          dispatch(ChatAction.declineTheIncomingCall());
        }
      },
      add_new_conversation: ({ conversationId }) => {
        getConversation({ id: conversationId });
        // TODO
        getUnseenMessages({ cachedKey: 'all' });
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
      receive_signal: ({ peerId, signal, callerId }) => {
        if (callerId === account.id && !chat.callState.accepted) {
          dispatch(ChatAction.acceptCall());
        }
        const signals = JSON.parse(window.localStorage.getItem('remoteSignals'));
        localStorage.setItem('remoteSignals', JSON.stringify({ ...signals, [peerId]: signal }));
        peers[peerId] && peers[peerId].signal(signal);
      },
      disconnect: () => {
        updateOnline({ online: false });
      },
      error: ({ error }) => {
        console.error('error', error);
      },
    };
    const [socket, unSubscribe] = registerSocket(events);
    setSocket(socket);
    return () => {
      unSubscribe(Object.keys(events));
    };
  }, []);

  return socketState;
};

export default useSocket;
