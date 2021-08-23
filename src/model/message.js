import { produce } from 'immer';
import remove from 'lodash.remove';
import reverse from 'lodash.reverse';

import {
  getMessage,
  getMessages,
  sendMessage,
  seenMessages,
  getUnseenMessages,
} from 'services/message';
import Conversation from 'entities/Conversation';
import Message from 'entities/Message';
import { getBase64 } from 'utils';

const messageModel = {
  name: 'message',
  state: {
    messages: {}, // {[id]: message}
    getMessages: {}, // {[cachedKey]: {ids: [], loading: Boolean, error: {}}}
    getUnseenMessages: {},
    getMessage: {},
    seeMessages: {},
    sendMessage: {},
  },
  reducers: {
    getMessages: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.messages = payload.messages.reduce(
            (s, msg) => ({ ...s, [msg.id]: msg }),
            state.messages,
          );
          state.getMessages[payload.cachedKey] = {
            total: payload.total,
            ids: [
              ...reverse(
                payload.messages
                  .map(m => m.id)
                  .filter(id => !state.getMessages[payload.cachedKey]?.ids?.includes(id)),
              ),
              ...(state.getMessages[payload.cachedKey]?.ids || []),
            ],
          };
          break;
        case 'error':
          state.getMessages[payload.cachedKey] = {
            ...state.getMessages[payload.cachedKey],
            error: payload.error,
          };
          break;
        default:
          state.getMessages[payload.cachedKey] = {
            loading: true,
            ...state.getMessages[payload.cachedKey],
          };
          break;
      }
    }),
    getMessagesWithoutLoading: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.messages = payload.messages.reduce(
            (s, msg) => ({ ...s, [msg.id]: msg }),
            state.messages,
          );
          state.getMessages[payload.cachedKey] = {
            total: payload.total,
            ids: [
              ...reverse(
                payload.messages
                  .map(m => m.id)
                  .filter(id => !state.getMessages[payload.cachedKey]?.ids?.includes(id)),
              ),
              ...(state.getMessages[payload.cachedKey]?.ids || []),
            ],
          };
          break;
        case 'error':
          return state;
        default:
          return state;
      }
    }),
    getMessage: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.messages[payload.message.id] = payload.message;
          state.getMessages[payload.cachedKey] = {
            total: (state.getMessages[payload.cachedKey]?.total || 0) + 1,
            ids: [...(state.getMessages[payload.cachedKey]?.ids || []), payload.message.id],
          };
          break;
        case 'error':
          state.getMessage[payload.cachedKey] = {
            error: payload.error,
          };
          break;
        default:
          state.getMessage[payload.cachedKey] = { loading: true };
          break;
      }
    }),
    sendMessage: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          delete state.messages[payload.keyMsg];
          state.messages[payload.message.id] = { ...payload.message };

          if (typeof payload.message.conversation === 'object') {
            state.messages[payload.message.id].conversation = payload.message.conversation.id;
            delete state.getMessages[payload.cachedKey];
            state.getMessages[payload.message.conversation.id] = {
              total: 1,
              ids: [payload.message.id],
            };
            state.sendMessage = {};

            break;
          }

          state.getMessages[payload.cachedKey] = {
            total: (state.getMessages[payload.cachedKey]?.total || 0) + 1,
            ids: [
              ...(state.getMessages[payload.cachedKey]?.ids || []).filter(
                id => id !== payload.keyMsg,
              ),
              payload.message.id,
            ],
          };
          state.sendMessage = {};
          break;
        case 'error':
          state.sendMessage = { error: payload };
          delete state.messages[payload.keyMsg].sending;
          state.messages[payload.keyMsg].error = payload.error;
          break;
        default:
          state.sendMessage = { loading: true };
          state.messages[payload.keyMsg] = { sending: true, ...payload };
          state.getMessages[payload.conversationId || payload.friendId] = {
            ...state.getMessages[payload.conversationId || payload.friendId],
            ids: !state.getMessages[payload.conversationId || payload.friendId]?.ids?.includes(
              payload.keyMsg,
            )
              ? [
                  ...(state.getMessages[payload.conversationId || payload.friendId]?.ids || []),
                  payload.keyMsg,
                ]
              : [...(state.getMessages[payload.conversationId || payload.friendId]?.ids || [])],
          };
          break;
      }
    }),
    seeMessages: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.messages = payload.messages.reduce((s, m) => ({ ...s, [m.id]: m }), state.messages);
          state.seeMessages[payload.conversationId] = {};
          state.getUnseenMessages.all.total -= payload.total || 0;
          remove(state.getUnseenMessages.all.ids, id => payload.messages.some(m => m.id === id));
          delete state.getUnseenMessages[payload.conversationId];
          break;
        case 'error':
          state.seeMessages[payload.conversationId] = { error: payload };
          break;
        default:
          state.seeMessages[payload.conversationId] = {
            loading: true,
          };
          break;
      }
    }),
    getMessagesOtherUserHasSeen: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.messages = payload.reduce((s, m) => ({ ...s, [m.id]: m }), state.messages);
          break;
        case 'error':
          return state;
        default:
          return state;
      }
    }),
    getUnseenMessages: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.messages = payload.messages.reduce(
            (s, msg) => ({ ...s, [msg.id]: msg }),
            state.messages,
          );
          state.getUnseenMessages[payload.cachedKey] = {
            total: payload.total,
            ids: [
              ...(state.getUnseenMessages[payload.cachedKey]?.ids || []),
              ...payload.messages
                .map(m => m.id)
                .filter(id => !state.getUnseenMessages[payload.cachedKey]?.ids?.includes(id)),
            ],
          };
          break;
        case 'error':
          state.getUnseenMessages[payload.cachedKey] = {
            ...state.getUnseenMessages[payload.cachedKey],
            error: payload.error,
          };
          break;
        default:
          state.getUnseenMessages[payload.cachedKey] = {
            loading: true,
            ...state.getUnseenMessages[payload.cachedKey],
          };
          break;
      }
    }),
  },
  effects: {
    getMessages: async (payload, onSuccess, onError) => {
      const { cachedKey, ...params } = payload;
      try {
        const { messages, total } = await getMessages(params);
        onSuccess({ cachedKey, messages, total });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    getMessagesWithoutLoading: async (payload, onSuccess, onError) => {
      const { cachedKey, ...params } = payload;
      try {
        const { messages, total } = await getMessages(params);
        onSuccess({ cachedKey, messages, total });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    getUnseenMessages: async (payload, onSuccess, onError) => {
      const { cachedKey, ...params } = payload;
      try {
        const { messages, total } = await getUnseenMessages(params);
        onSuccess({ cachedKey, messages, total });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    getMessage: async ({ cachedKey, ...payload }, onSuccess, onError) => {
      try {
        const message = await getMessage(payload);
        onSuccess({ cachedKey, message });
      } catch (error) {
        onError({ cachedKey, error });
      }
    },
    sendMessage: async ({ keyMsg, ...payload }, onSuccess, onError) => {
      try {
        if (payload.contentType === Message.CONTENT_TYPE_IMAGE) {
          payload.base64Image = (await getBase64(payload.imageUrl)).replace(
            /^data:image\/[a-z]+;base64,/,
            '',
          );
          delete payload.imageUrl;
          delete payload.contentBlob;
        }
        const message = await sendMessage(payload);
        onSuccess({
          cachedKey: payload.conversationId,
          keyMsg,
          message,
        });
      } catch (error) {
        onError({ keyMsg, error });
      }
    },
    seeMessages: async (payload, onSuccess, onError) => {
      try {
        const { messages, total } = await seenMessages(payload);
        onSuccess({
          conversationId: payload.conversationId,
          messages,
          total,
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
    getMessagesWithoutLoading: params => params,
    getMessage: params => params,
    getUnseenMessages: params => params,
    sendMessage: params => params,
    seeMessages: params => params,
    getMessagesOtherUserHasSeen: params => params,
  },
  crossReducers: {
    sendMessage: produce((state, payload) => {
      const { conversation } = payload.message;
      if (typeof conversation === 'object') {
        state.conversation.conversations[conversation.id] = new Conversation(conversation);
        state.conversation.getConversations.ids.push(conversation.id);
      }
    }),
  },
};

export default messageModel;
