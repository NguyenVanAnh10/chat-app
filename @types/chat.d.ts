interface IChatState {
  conversationId: string;
  caller: { id: string };
  peers: object; // {[peerId]: peer}
  streamVideos: IStreamVideos;
  callState: ICallState;
}

interface ICallState {
  hasReceived: boolean;
  accepted: boolean;
  declined: boolean;
  isOutgoing: boolean;
}

interface IStreamVideos {
  current: object;
  remotes: object /** {peerId: stream} */;
  error: object;
}
