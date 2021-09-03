export default class Action {
  static CLOSE_OUTGOING_CALL_WINDOW = 'CLOSE_OUTGOING_CALL_WINDOW';
  static ACCEPT_CALL = 'ACCEPT_CALL';
  static MAKE_OUTGOING_CALL = 'MAKE_OUTGOING_CALL';

  static ADD_CURRENT_OUTGOING_STREAM = 'ADD_CURRENT_OUTGOING_STREAM';
  static ADD_REMOTE_OUTGOING_STREAM = 'ADD_REMOTE_OUTGOING_STREAM';
  static ERROR_REMOTE_OUTGOING_STREAM = 'ERROR_REMOTE_OUTGOING_STREAM';

  static ADD_CURRENT_ANSWER_STREAM = 'ADD_CURRENT_ANSWER_STREAM';
  static ADD_REMOTE_ANSWER_STREAM = 'ADD_REMOTE_ANSWER_STREAM';
  static ERROR_REMOTE_ANSWER_STREAM = 'ERROR_REMOTE_ANSWER_STREAM';

  static DECLINE_CALL = 'DECLINE_CALL';
  static LEAVE_CALL = 'LEAVE_CALL';

  static HAVE_A_COMING_CALL = 'HAVE_A_COMING_CALL';
  static END_CALL = 'END_CALL';

  static DECLINE_THE_INCOMING_CALL = 'DECLINE_THE_INCOMING_CALL';
  static RECEIVE_SIGNAL = 'RECEIVE_SIGNAL';
}
