import produce from 'immer';

import Action from 'entities/Action';

export const initChat = {
  conversationId: '',
  caller: {},
  peers: {},
  streamVideos: { remotes: {}, error: {} }, // {current, remote, error: {}}
  callState: {}, // {hasReceived, accepted, declined, isOutgoing}
};

export function init(initState) {
  return initState;
}

const reducer = produce((state, { type, payload }) => {
  switch (type) {
    case Action.CLOSE_OUTGOING_CALL_WINDOW:
      return initChat;
    case Action.ACCEPT_CALL:
      state.callState = { accepted: true };
      break;
    case Action.MAKE_OUTGOING_CALL:
      state.callState = { isOutgoing: true };
      state.conversationId = payload.conversationId;
      break;
    case Action.ADD_CURRENT_OUTGOING_STREAM:
      state.streamVideos.current = payload.current;
      break;
    case Action.ADD_REMOTE_OUTGOING_STREAM:
      state.streamVideos.remotes = {
        ...state.streamVideos.remotes,
        ...payload,
      };
      break;
    case Action.ERROR_REMOTE_ANSWER_STREAM:
    case Action.ERROR_REMOTE_OUTGOING_STREAM:
      state.streamVideos = {
        ...state.streamVideos,
        ...payload,
      };
      break;
    case Action.ADD_CURRENT_ANSWER_STREAM:
      state.streamVideos.current = payload.current;
      state.callState.accepted = true;
      break;

    case Action.ADD_REMOTE_ANSWER_STREAM:
      state.streamVideos.remotes = { ...state.streamVideos.remotes, ...payload };
      break;
    case Action.HAVE_A_COMING_CALL:
      state.conversationId = payload.conversationId;
      state.caller = payload.caller;
      state.callState.hasReceived = true;
      break;
    case Action.DECLINE_THE_INCOMING_CALL:
      state.callState.declined = true;
      break;
    case Action.DECLINE_CALL:
    case Action.LEAVE_CALL:
    case Action.END_CALL:
      return init(initChat);
    default:
      return state;
  }
});

export default reducer;
