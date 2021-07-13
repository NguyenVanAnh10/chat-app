import {
  getMessage,
  getMessages,
  getConversation,
  getConversations,
  sendMessage,
  haveSeenMessages,
  createConversation,
} from 'services/message';
import accountServices from 'services/account';

const { getMe } = accountServices;

const messageModel = {
  name: 'message',
  state: {
    messages: {}, // {[id]: message}
    getMessages: {}, // {[cachedKey]: {ids: [], loading: Boolean, error: {}}}
    getMessage: {},
    conversations: {},
    getConversations: { ids: [] }, // {ids: [], loading, error}
    getConversation: {},
    createConversation: {},
    seeMessages: {},
    sendMessage: {},
  },
  reducers: {
    getMessages: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: payload.messages.reduce(
              (s, msg) => ({ ...s, [msg.id]: msg }),
              state.messages,
            ),
            getMessages: {
              ...state.getMessages,
              [payload.cachedKey]: { ids: [
                ...(state.getMessages[payload.cachedKey]?.ids || []),
                ...payload.messages
                  .map(m => m.id)
                  .filter(id => !state.getMessages[payload.cachedKey]?.ids?.includes(id)),
              ] },
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
          return {
            ...state,
            getMessages: {
              ...state.getMessages,
              [payload.cachedKey]: {
                loading: true,
                ...state.getMessages[payload.cachedKey],
              },
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
              [payload.message.id]: payload.message,
            },
            getMessages: {
              ...state.getMessages,
              [payload.cachedKey]: {
                ids: [
                  ...(state.getMessages[payload.cachedKey]?.ids || []),
                  payload.message.id,
                ],
              },
            },
            getMessage: { [payload.cachedKey]: {} },
            conversations: {
              ...state.conversations,
              [payload.message.conversationId]: {
                ...state.conversations[payload.message.conversationId],
                messageIds: [
                  ...(state.conversations[payload.message.conversationId].messageIds || []),
                  payload.message.id],
              },
            },
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
          return {
            ...state,
            getMessage: {
              [payload.cachedKey]: { loading: true },
            },
          };
      }
    },
    getConversations: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            conversations: payload.reduce(
              (s, r) => ({ ...s, [r.id]: r }),
              state.conversations,
            ),
            getConversations: {
              ...state.getConversations,
              ids: payload.map(r => r.id),
            },
          };
        case 'error':
          return { ...state, getConversations: { error: payload } };
        default:
          return { ...state, getConversations: { loading: true } };
      }
    },
    getConversation: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            conversations: { ...state.conversations, [payload.id]: payload },
            getConversations: {
              ids: state.getConversations.ids.includes(payload.id)
                ? state.getConversations.ids
                : [...state.getConversations.ids, payload.id],
            },
            getConversation: { id: payload.id },
          };
        case 'error':
          return { ...state, getConversation: { error: payload } };
        default:
          return { ...state, getConversation: { loading: true } };
      }
    },
    createConversation: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            createConversation: payload,
          };
        case 'error':
          return { ...state, createConversation: { error: payload } };
        default:
          return { ...state, createConversation: { loading: true } };
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
              [payload.message.id]: {
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
                  payload.message.id,
                ],
              },
            },
            sendMessage: {
              [payload.keyMsg]: undefined,
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
              [payload.conversationId]: {
                ids: [
                  ...(state.getMessages[payload.conversationId]?.ids || []),
                  payload.keyMsg,
                ],
              },
            },
          };
      }
    },
    seeMessages: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: payload.messages.reduce(
              (s, m) => ({ ...s, [m.id]: m }),
              state.messages,
            ),
            seeMessages: {
              ...state.seeMessages,
              [payload.conversationId]: {},
            },
          };
        case 'error':
          return {
            ...state,
            seeMessages: {
              ...state.seeMessages,
              [payload.conversationId]: {
                error: payload.error,
              },
            },
          };
        default:
          return {
            ...state,
            seeMessages: {
              ...state.seeMessages,
              [payload.conversationId]: {
                loading: true,
              },
            },
          };
      }
    },
    getMessagesOtherUserHasSeen: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            messages: payload.reduce(
              (s, m) => ({ ...s, [m.id]: m }),
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
    getMessages: async ({ cachedKey, ...payload }, onSuccess, onError) => {
      try {
        onSuccess({ cachedKey, messages: await getMessages(payload) });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    getMessage: async ({ cachedKey, ...payload }, onSuccess, onError) => {
      try {
        onSuccess({ cachedKey, message: await getMessage(payload) });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    getConversations: async (payload, onSuccess, onError) => {
      try {
        if (!payload.userId) {
          // eslint-disable-next-line no-param-reassign
          payload.userId = (await getMe()).id;
        }
        onSuccess(await getConversations(payload.userId));
      } catch (error) {
        onError(error);
      }
    },
    createConversation: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await createConversation(payload));
      } catch (error) {
        onError(error);
      }
    },
    getConversation: async (payload, onSuccess, onError) => {
      try {
        if (!payload.userId) {
          // eslint-disable-next-line no-param-reassign
          payload.userId = (await getMe()).id;
        }
        onSuccess(await getConversation(payload));
      } catch (error) {
        onError(error);
      }
    },
    sendMessage: async ({ keyMsg, ...payload }, onSuccess, onError) => {
      try {
        onSuccess({
          cachedKey: payload.conversationId,
          keyMsg,
          message: (await sendMessage(payload)).message,
        });
      } catch (error) {
        onError({ keyMsg, error });
      }
    },
    seeMessages: async (payload, onSuccess, onError) => {
      try {
        onSuccess({
          conversationId: payload.conversationId,
          messages: await haveSeenMessages(payload),
        });
      } catch (error) {
        onError({ conversationId: payload.conversationId, error: {} });
      }
    },
    getMessagesOtherUserHasSeen: async (payload, onSuccess, onError) => {
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
    getConversation: params => params,
    getConversations: userId => ({ userId }),
    createConversation: params => params,
    sendMessage: params => params,
    seeMessages: params => params,
    getMessagesOtherUserHasSeen: params => params,
  },
};

export default messageModel;
