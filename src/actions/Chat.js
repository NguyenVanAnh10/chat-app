import Action from 'entities/Action';

const closeOutgoingCallWindow = () => ({ type: Action.CLOSE_OUTGOING_CALL_WINDOW });
const acceptCall = () => ({ type: Action.ACCEPT_CALL });
const makeOutgoingCall = conversationId => ({
  type: Action.MAKE_OUTGOING_CALL,
  payload: { conversationId },
});

const addCurrentOutgoingStream = stream => ({
  type: Action.ADD_CURRENT_OUTGOING_STREAM,
  payload: { current: stream },
});

const addRemoteOutgoingStream = (peerId, stream) => ({
  type: Action.ADD_REMOTE_OUTGOING_STREAM,
  payload: { [peerId]: stream },
});

const errorRemoteOutgoingStream = error => ({
  type: Action.ERROR_REMOTE_OUTGOING_STREAM,
  payload: {
    error: {
      name: 'CURRENT_STREAM',
      message: error.message,
    },
  },
});

const addCurrentAnswerStream = stream => ({
  type: Action.ADD_CURRENT_ANSWER_STREAM,
  payload: { current: stream },
});

const addRemoteAnswerStream = (peerId, stream) => ({
  type: Action.ADD_REMOTE_ANSWER_STREAM,
  payload: { [peerId]: stream },
});

const errorRemoteAnswerStream = error => ({
  type: Action.ERROR_REMOTE_ANSWER_STREAM,
  payload: {
    error: {
      name: 'REMOTE_STREAM',
      message: error.message,
    },
  },
});

const declineCall = () => ({ type: Action.DECLINE_CALL });
const leaveCall = () => ({ type: Action.LEAVE_CALL });

/**
 *
 * @param {{conversationId: string ,caller: { id: string }}} payload
 * @returns {{
 *      type: Action.HAVE_A_COMING_CALL,
 *      payload: {conversationId: string ,caller: { id: string }}
 * }}
 */
const haveAComingCall = payload => ({
  type: Action.HAVE_A_COMING_CALL,
  payload,
});

const endCall = () => ({ type: Action.END_CALL });

const declineTheIncomingCall = () => ({ type: Action.DECLINE_THE_INCOMING_CALL });
const receiveSignal = () => ({ type: Action.RECEIVE_SIGNAL });

export default {
  acceptCall,
  closeOutgoingCallWindow,
  makeOutgoingCall,
  addCurrentOutgoingStream,
  addRemoteOutgoingStream,
  errorRemoteOutgoingStream,
  addCurrentAnswerStream,
  addRemoteAnswerStream,
  errorRemoteAnswerStream,
  declineCall,
  leaveCall,
  haveAComingCall,
  endCall,
  declineTheIncomingCall,
  receiveSignal,
};
