import { v4 as uuid } from 'uuid';
import Peer from 'simple-peer';

import { turnOnCameraAndAudio, stopStreame } from 'utils';
import Notification from './Notification';
import Message from './Message';
import ChatAction from 'actions/Chat';

export default class SocketHandler {
  constructor(options) {
    this.initChat = options.initChat;
    this.account = options.account;
    this.socket = options.socket;
    Object.keys(options.actions).forEach(action => {
      this[action] = options.actions[action];
    });
  }

  onCallFriend =
    ({ conversationId, peerIds = [] }) =>
    async ({ peers, dispatch }) => {
      try {
        const currentStream = await turnOnCameraAndAudio();
        dispatch(ChatAction.addCurrentOutgoingStream(currentStream));
        peerIds
          .filter(id => id !== this.account.id)
          .forEach(peerId => {
            if (peers[peerId]) return;
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
              channelName: peerId,
              stream: currentStream,
            });
            peer.on('signal', signal => {
              this.socket.emit('call_to', {
                signal,
                callerId: this.account.id,
                conversationId,
                peerIds,
                peerId,
              });
            });

            peer.on('stream', remoteStream => {
              dispatch(ChatAction.addRemoteOutgoingStream(peerId, remoteStream));
            });

            // eslint-disable-next-line no-underscore-dangle
            peer._debug = console.log;
            peers[peerId] = peer;
          });
      } catch (error) {
        dispatch(ChatAction.errorRemoteOutgoingStream(error));
        console.error('Failed to get local stream', error);
      }
    };

  onAnswerCall =
    ({ remoteSignals, conversationId, peerIds = [], callerId }) =>
    async ({ peers, dispatch }) => {
      try {
        const currentStream = await turnOnCameraAndAudio();
        dispatch(ChatAction.addCurrentAnswerStream(currentStream));

        peerIds.sort().forEach((peerId, index) => {
          const currentPeerIndex = peerIds.sort().findIndex(i => i === this.account.id);

          if (peers[peerId] || currentPeerIndex === index) return;
          peers[peerId] =
            index < currentPeerIndex || peerId === callerId
              ? new Peer({
                  initiator: false,
                  trickle: false,
                  stream: currentStream,
                })
              : new Peer({
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
                  channelName: peerId,
                  stream: currentStream,
                });

          peers[peerId].on('signal', signal => {
            this.socket.emit('share_signal', {
              meId: this.account.id,
              conversationId,
              signal,
              peerId,
              callerId,
            });
          });

          peers[peerId].on('stream', remoteStream => {
            dispatch(ChatAction.addRemoteAnswerStream(peerId, remoteStream));
          });

          JSON.parse(remoteSignals)[peerId] &&
            peers[peerId].signal(JSON.parse(remoteSignals)[peerId]);

          // eslint-disable-next-line no-underscore-dangle
          peers[peerId]._debug = console.log;
        });
      } catch (error) {
        dispatch(ChatAction.errorRemoteAnswerStream(error));
        console.error('Failed to get local stream', error);
      }
    };

  onDeclineCall =
    callerId =>
    ({ chat, dispatch }) => {
      dispatch(ChatAction.declineCall());
      declineCall({
        callerId,
        conversationId: chat.conversationId,
        socket: this.socket,
        account: this.account,
        sendMessage: this.sendMessage,
      });
    };

  onLeaveCall =
    conversationId =>
    ({ peers, chat, dispatch }) => {
      dispatch(ChatAction.leaveCall());
      destroyCall({ peers, stream: chat.streamVideos.current });
      this.socket.emit('end_call', { userId: this.account.id, conversationId });
      if (chat.callState.accepted) {
        this.sendMessage({
          conversationId,
          contentType: Message.CONTENT_TYPE_NOTIFICATION,
          content: Notification.NOTIFICATION_ENDED_CALL,
          keyMsg: uuid(),
          sender: this.account.id,
        });
      }
    };
}

export const destroyCall = ({ peers, stream }) => {
  Object.keys(peers).forEach(id => peers[id].destroy());
  stopStreame(stream);
};

/**
 *
 * @param {{
 * callerId: string,
 * conversationId:string,
 * socket: Socket,
 * account: IAccount,
 * sendMessage: () => ({})
 * }}
 */
export const declineCall = ({ callerId, conversationId, socket, account, sendMessage }) => {
  socket.emit('decline_the_incoming_call', {
    callerId,
    conversationId,
  });
  sendMessage({
    conversationId,
    contentType: Message.CONTENT_TYPE_NOTIFICATION,
    content: Notification.NOTIFICATION_DECLINE_CALL,
    keyMsg: uuid(),
    sender: account.id,
  });
};
