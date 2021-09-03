import React, { useContext, useEffect } from 'react';
import { useUpdateEffect } from 'react-use';
import { useLocation } from 'react-router-dom';
import qs from 'query-string';

import { ChatContext } from 'pages/ChatApp';
import { useConversation } from 'hooks/useConversations';
import ChatVideoContainer from 'components/ChatVideoContainer';

const IncomingCall = () => {
  const { callerId, conversationId } = qs.parse(useLocation().search);
  const remoteSignals = window.localStorage.getItem('remoteSignals');

  const [{ streamVideos, callState }, { onLeaveCall, onAnswerCall }] = useContext(ChatContext);

  const [{ conversation }] = useConversation({ conversationId }, { forceFetching: true });

  useEffect(() => {
    conversation.id &&
      onAnswerCall({
        remoteSignals,
        conversationId,
        peerIds: conversation.members.map(m => m.id),
        callerId,
      });
  }, [conversation.id]);

  useUpdateEffect(() => {
    // finish call
    if (
      (!callState.accepted && !callState.declined) ||
      callState.declined ||
      callState.isOutgoing
    ) {
      window.close();
    }
  }, [callState.accepted, callState.declined, callState.isOutgoing]);

  return (
    <ChatVideoContainer
      callState={callState}
      streamVideos={streamVideos}
      handleStopingCall={() => {
        onLeaveCall(conversationId || conversation.id);
        window.close();
      }}
    />
  );
};

export default IncomingCall;
