import {
  getMessage,
  getMessages,
  getRoom,
  getRooms,
  sendMessage,
  haveSeenMessages,
  createRoom,
} from "services/message";
import serviceAccount from "services/account";

const messageModel = {
  name: "message",
  state: {
    messages: {}, // {[id]: message}
    getMessages: {
      ids: [],
    }, // {ids: [], loading: Boolean, error: {}}
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
        case "success":
          return {
            ...state,
            messages: payload.reduce(
              (s, msg) => ({ ...s, [msg._id]: msg }),
              state.messages
            ),
            getMessages: { ids: payload.map((m) => m._id) },
          };
        case "error":
          return { ...state, getMessages: { error: payload } };
        default:
          return { ...state, getMessages: { loading: true } };
      }
    },
    getMessage: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            messages: { ...state.messages, [payload._id]: payload },
            getMessages: { ids: [...state.getMessages.ids, payload._id] },
            getMessage: {},
          };
        case "error":
          return { ...state, getMessage: { error: payload } };
        default:
          return { ...state, getMessage: { loading: true } };
      }
    },
    getRooms: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            rooms: payload.reduce(
              (s, r) => ({ ...s, [r._id]: r }),
              state.rooms
            ),
            getRooms: {
              ...state.getRooms,
              ids: payload.map((r) => r._id),
            },
          };
        case "error":
          return { ...state, getRooms: { error: payload } };
        default:
          return { ...state, getRooms: { loading: true } };
      }
    },
    getRoom: (state, { status, payload }) => {
      switch (status) {
        case "success":
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
        case "error":
          return { ...state, getRoom: { error: payload } };
        default:
          return { ...state, getRoom: { loading: true } };
      }
    },
    createRoom: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            createRoom: payload,
          };
        case "error":
          return { ...state, createRoom: { error: payload } };
        default:
          return { ...state, createRoom: { loading: true } };
      }
    },
    sendMessage: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            messages: {
              ...state.messages,
              [payload.keyMsg]: undefined,
              [payload.message._id]: payload.message,
            },
            getMessages: {
              ...state.getMessages,
              ids: [
                ...state.getMessages.ids.filter((id) => id !== payload.keyMsg),
                payload.message._id,
              ],
            },
            sendMessage: {
              [payload.keyMsg]: payload.message,
            },
          };
        case "error":
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
              ids: [...state.getMessages.ids, payload.keyMsg],
            },
          };
      }
    },
    haveSeenNewMessages: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            messages: payload.reduce(
              (s, m) => ({ ...s, [m._id]: m }),
              state.messages
            ),
          };
        case "error":
          return state;
        default:
          return state;
      }
    },
    getHaveSeenNewMessages: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            messages: payload.reduce(
              (s, m) => ({ ...s, [m._id]: m }),
              state.messages
            ),
          };
        case "error":
          return state;
        default:
          return state;
      }
    },
  },
  effects: {
    getMessages: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getMessages(payload));
      } catch (error) {
        onError(error);
      }
    },
    getMessage: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getMessage(payload));
      } catch (error) {
        onError(error);
      }
    },
    getRooms: async (payload, onSuccess, onError) => {
      try {
        if (!payload.userId) {
          payload.userId = (await serviceAccount.getMe())._id;
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
          payload.userId = (await serviceAccount.getMe())._id;
        }
        onSuccess(await getRoom(payload));
      } catch (error) {
        onError(error);
      }
    },
    sendMessage: async (params, onSuccess, onError) => {
      try {
        onSuccess({
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
    getMessages: (params) => params,
    getMessage: (params) => params,
    getRoom: (params) => params,
    getRooms: (userId) => ({ userId }),
    createRoom: (params) => params,
    sendMessage: (params) => params,
    haveSeenNewMessages: (params) => params,
    getHaveSeenNewMessages: (params) => params,
  },
};

export default messageModel;
