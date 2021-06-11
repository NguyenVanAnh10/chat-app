import { io } from 'socket.io-client';

const socketContainer = {
  initSocket() {
    this.socket = io(process.env.REACT_APP_HEROKU_API);
  },
};

export const registerSocket = (events = {}) => {
  if (!socketContainer.socket) {
    socketContainer.initSocket();
  }
  const { socket } = socketContainer;

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
