import produce from 'immer';

import Conversation from 'entities/Conversation';
import {
  getConversation,
  getConversations,
  createConversation,
} from 'services/conversation';
import { mergeObjects } from 'utils';

const conversationModel = {
  name: 'conversation',
  state: {
    conversations: {},
    getConversations: { ids: [] }, // {ids: [], loading, error}
    getConversation: {},
    createConversation: {},
  },
  reducers: {
    getConversations: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.conversations = payload.reduce(
            (s, r) => ({ ...s, [r.id]: new Conversation(r) }),
            state.conversations,
          );
          state.getConversations.ids = payload.map(r => r.id);
          state.getConversations.loading = false;
          state.getConversations.error = null;
          break;
        case 'error':
          state.getConversations.loading = false;
          state.getConversations.error = payload;
          break;
        default:
          state.getConversations.loading = true;
          break;
      }
    }),
    getConversation: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.conversations[payload.id] = new Conversation(payload);
          state.getConversation.loading = false;
          state.getConversation.error = null;

          if (state.getConversations.ids.includes(payload.id)) break;
          state.getConversations.ids.push(payload.id);
          break;
        case 'error':
          state.getConversation.error = payload;
          break;
        default:
          state.getConversation.loading = true;
          break;
      }
    }),
    createConversation: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.conversations[payload.id] = new Conversation(payload);

          if (state.getConversations.ids.includes(payload.id)) break;
          state.getConversations.ids.push(payload.id);
          state.createConversation = { id: payload.id };
          break;
        case 'error':
          state.createConversation = { error: payload };
          break;
        default:
          state.createConversation = { loading: true };
          break;
      }
    }),
  },
  effects: {
    getConversations: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getConversations());
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
        onSuccess(await getConversation(payload));
      } catch (error) {
        onError(error);
      }
    },
  },
  actions: {
    getConversations: () => ({}),
    getConversation: id => id,
    createConversation: params => params,
  },
  crossReducers: {
    getConversations: produce((state, payload) => {
      payload.forEach(p => {
        p.members.forEach(pp => {
          state.user.users[pp.id] = mergeObjects([state.user.users[pp.id], pp]);
        });
      });
    }),
  },
};

export default conversationModel;
