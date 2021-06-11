import qs from 'query-string';

import {
  getMessage,
  getMessages,
  getRoom,
  getRooms,
  sendMessage,
  haveSeenMessages,
  createRoom,
} from 'services/message';
import { getMe } from 'services/account';

const messageModel = {
  name: 'message',
  state: {
    messages: {}, // {[id]: message}
    getMessages: {}, // {[cachedKey]: {ids: [], loading: Boolean, error: {}}}
    getMessage: {},
    rooms: {},
    getRooms: { ids: [] }, // {ids: [], loading, error}
    getRoom: {},
    createRoom: {},
    sendMessage: {},
  },
  reducers: {
    getMessages: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: payload.messages.reduce(
              (s, msg) => ({ ...s, [msg._id]: msg }),
              state.messages,
            ),
            getMessages: {
              ...state.getMessages,
              [payload.cachedKey]: { ids: payload.messages.map(m => m._id) },
            },
          };
        case 'error':
          return {
            ...state,
            getMessages: {
              ...state.getMessages,
              [payload.cachedKey]: { error: payload.error },
            },
          };
        default:
          const cachedKey = qs.stringify({
            roomId: payload.roomId,
            userId: payload.userId,
          });

          return {
            ...state,
            getMessages: {
              ...state.getMessages,
              [cachedKey]: { loading: true },
            },
          };
      }
    },
    getMessage: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: {
              ...state.messages,
              [payload.message._id]: payload.message,
            },
            getMessages: {
              ...state.getMessages,
              [payload.cachedKey]: {
                ids: [
                  ...(state.getMessages[payload.cachedKey]?.ids || []),
                  payload.message._id,
                ],
              },
            },
            getMessage: { [payload.cachedKey]: {} },
          };
        case 'error':
          return {
            ...state,
            getMessage: {
              [payload.cachedKey]: {
                error: payload.error,
              },
            },
          };
        default:
          const cachedKey = qs.stringify({
            roomId: payload.roomId,
            userId: payload.userId,
          });
          return {
            ...state,
            getMessage: {
              [cachedKey]: { loading: true },
            },
          };
      }
    },
    getRooms: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            rooms: payload.reduce(
              (s, r) => ({ ...s, [r._id]: r }),
              state.rooms,
            ),
            getRooms: {
              ...state.getRooms,
              ids: payload.map(r => r._id),
            },
          };
        case 'error':
          return { ...state, getRooms: { error: payload } };
        default:
          return { ...state, getRooms: { loading: true } };
      }
    },
    getRoom: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            rooms: { ...state.rooms, [payload._id]: payload },
            getRooms: {
              ids: state.getRooms.ids.includes(payload._id)
                ? state.getRooms.ids
                : [...state.getRooms.ids, payload._id],
            },
            getRoom: { id: payload._id },
          };
        case 'error':
          return { ...state, getRoom: { error: payload } };
        default:
          return { ...state, getRoom: { loading: true } };
      }
    },
    createRoom: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            createRoom: payload,
          };
        case 'error':
          return { ...state, createRoom: { error: payload } };
        default:
          return { ...state, createRoom: { loading: true } };
      }
    },
    sendMessage: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: {
              ...state.messages,
              [payload.keyMsg]: undefined,
              [payload.message._id]: {
                ...payload.message,
                contentBlob: state.messages[payload.keyMsg].contentBlob,
              },
            },
            getMessages: {
              ...state.getMessages,
              [payload.cachedKey]: {
                ids: [
                  ...(state.getMessages[payload.cachedKey]?.ids || []).filter(
                    id => id !== payload.keyMsg,
                  ),
                  payload.message._id,
                ],
              },
            },
            sendMessage: {
              [payload.keyMsg]: payload.message,
            },
          };
        case 'error':
          return {
            ...state,
            messages: {
              ...state.messages,
              [payload.keyMsg]: {
                ...state.messages[payload.keyMsg],
                error: payload.error,
              },
            },
            sendMessage: {
              [payload.keyMsg]: { error: payload.error },
            },
          };
        default:
          const cachedKey = qs.stringify({
            roomId: payload.roomId,
            userId: payload.senderId,
          });

          return {
            ...state,
            messages: {
              ...state.messages,
              [payload.keyMsg]: payload,
            },
            sendMessage: {
              [payload.keyMsg]: {
                loading: true,
              },
            },
            getMessages: {
              ...state.getMessages,
              [cachedKey]: {
                ids: [
                  ...(state.getMessages[cachedKey]?.ids || []),
                  payload.keyMsg,
                ],
              },
            },
          };
      }
    },
    haveSeenNewMessages: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: payload.reduce(
              (s, m) => ({ ...s, [m._id]: m }),
              state.messages,
            ),
          };
        case 'error':
          return state;
        default:
          return state;
      }
    },
    getHaveSeenNewMessages: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: payload.reduce(
              (s, m) => ({ ...s, [m._id]: m }),
              state.messages,
            ),
          };
        case 'error':
          return state;
        default:
          return state;
      }
    },
  },
  effects: {
    getMessages: async (payload, onSuccess, onError) => {
      const cachedKey = qs.stringify({
        roomId: payload.roomId,
        userId: payload.userId,
      });

      try {
        onSuccess({ cachedKey, messages: await getMessages(payload) });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    getMessage: async (payload, onSuccess, onError) => {
      const cachedKey = qs.stringify({
        roomId: payload.roomId,
        userId: payload.userId,
      });
      try {
        onSuccess({ cachedKey, message: await getMessage(payload) });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    getRooms: async (payload, onSuccess, onError) => {
      try {
        if (!payload.userId) {
          payload.userId = (await getMe())._id;
        }
        onSuccess(await getRooms(payload.userId));
      } catch (error) {
        onError(error);
      }
    },
    createRoom: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await createRoom(payload));
      } catch (error) {
        onError(error);
      }
    },
    getRoom: async (payload, onSuccess, onError) => {
      try {
        if (!payload.userId) {
          payload.userId = (await getMe())._id;
        }
        onSuccess(await getRoom(payload));
      } catch (error) {
        onError(error);
      }
    },
    sendMessage: async (params, onSuccess, onError) => {
      const cachedKey = qs.stringify({
        roomId: params.roomId,
        userId: params.senderId,
      });
      try {
        onSuccess({
          cachedKey,
          keyMsg: params.keyMsg,
          message: (await sendMessage(params)).message,
        });
      } catch (error) {
        onError({ keyMsg: params.keyMsg, error });
      }
    },
    haveSeenNewMessages: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await haveSeenMessages(payload));
      } catch (error) {
        onError({});
      }
    },
    getHaveSeenNewMessages: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getMessages(payload));
      } catch (error) {
        onError({});
      }
    },
  },
  actions: {
    getMessages: params => params,
    getMessage: params => params,
    getRoom: params => params,
    getRooms: userId => ({ userId }),
    createRoom: params => params,
    sendMessage: params => params,
    haveSeenNewMessages: params => params,
    getHaveSeenNewMessages: params => params,
  },
};

export default messageModel;
