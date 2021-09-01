import { useContext, useEffect, useReducer, useRef } from 'react';
import { useBeforeUnload } from 'react-use';

import { AccountContext } from 'App';
import { useModel } from 'model';
import Action from 'entities/Action';
import SocketHandler from 'entities/SocketHandler';
import useSocket from 'socket';
import ChatAction from 'actions/Chat';
import chatReducer, { initChat, init } from 'react-reducer/chat';

const useChat = () => {
  const { account } = useContext(AccountContext);
  const [, { sendMessage }] = useModel('message', () => ({}));
  const [, { updateOnline }] = useModel('account', () => ({}));

  const peersRef = useRef({});
  const [chat, dispatch] = useReducer(chatReducer, initChat, init);

  const socket = useSocket({
    peers: peersRef.current,
    chat,
    dispatch,
  });

  const socketHandler = new SocketHandler({
    account,
    socket,
    initChat,
    actions: {
      sendMessage,
    },
  });

  useEffect(() => {
    window.addEventListener('message', ({ data }) => {
      switch (data.type) {
        case Action.CLOSE_OUTGOING_CALL_WINDOW:
          dispatch(ChatAction.closeOutgoingCallWindow());
          break;
        default:
          break;
      }
    });
  }, []);

  useBeforeUnload(() => {
    console.log('before upload');
    updateOnline({ online: false });
  });

  const onAcceptCall = () => {
    dispatch(ChatAction.acceptCall());
  };

  const onAnswerCall = async ({ remoteSignals, conversationId, peerIds = [], callerId }) => {
    socketHandler.onAnswerCall({ remoteSignals, conversationId, peerIds, callerId })({
      peers: peersRef.current,
      dispatch,
    });
  };

  const onOutgoingCall = conversationId => {
    if (chat.callState.accepted || chat.callState.isOutgoing) {
      return;
    }
    dispatch(ChatAction.makeOutgoingCall(conversationId));
  };

  const onCallFriend = async ({ conversationId, peerIds = [] }) => {
    socketHandler.onCallFriend({ conversationId, peerIds })({ peers: peersRef.current, dispatch });
  };

  const onDeclineCall = callerId => {
    socketHandler.onDeclineCall(callerId)({ chat, dispatch });
  };

  const onLeaveCall = conversationId => {
    socketHandler.onLeaveCall(conversationId)({ peers: peersRef.current, chat, dispatch });
  };

  return [
    chat,
    {
      onOutgoingCall,
      onCallFriend,
      onLeaveCall,
      onAnswerCall,
      onAcceptCall,
      onDeclineCall,
    },
  ];
};

export default useChat;
