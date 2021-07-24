/* eslint-disable no-param-reassign */
import produce from 'immer';

import {
  getMe,
  login,
  logout,
  updateMe,
  getFriend,
  getFriends,
  setPassword,
  updateOnline,
  validateEmail,
  updateStaticMe,
  registerAccount,
  addFriendRequest,
  getFriendRequester,
  confirmFriendRequest,
  getFriendRequestAddressees,
} from 'services/account';
import { mergeObjects } from 'utils';

const accountModel = {
  name: 'account',
  state: {
    me: {},
    getMe: {}, // { loading, error}
    updateMe: {},
    getFriends: {
      ids: [],
    }, // { loading, error}
    getFriend: {
    }, // { loading, error}
    addressees: {
      ids: [],
    },
    requesters: {
      ids: [],
    },
    confirmFriendRequest: {}, // {[id]: { loading, error}}
    registerAccount: {},
    validateEmail: {},
    setPassword: {},
    updateOnline: {},
    login: {},
    logout: {},
    statics: {
      icons: [],
    },
  },
  reducers: {
    getMe: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          const { statics, ...data } = payload;
          state.me = data;
          state.statics.icons = statics?.icons || state.statics.icons;
          state.getMe = {};
          break;
        case 'error':
          state.getMe = { error: payload };
          break;
        default:
          state.getMe = { loading: true };
          break;
      }
    }),
    updateMe: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.me = payload;
          state.updateMe = {};
          return;
        case 'error':
          state.updateMe = { error: payload };
          break;
        default:
          state.updateMe = { loading: true };
      }
    }),
    getFriends: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.getFriends.ids = payload.map(u => u.id);
          break;
        case 'error':
          state.getFriends.error = payload;
          state.getFriends.loading = false;
          return;
        default:
          state.getFriends.loading = true;
      }
    }),
    getFriend: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.getFriends.ids.push(payload.id);
          state.getFriend = {};
          break;
        case 'error':
          state.getFriend = { error: payload };
          return;
        default:
          state.getFriend = { loading: true };
      }
    }),
    getFriendRequestAddressees: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.addressees = {
            ids: payload.map(a => a.id),
          };
          break;
        case 'error':
          state.addressees.error = payload;
          state.addressees.loading = false;
          break;
        default:
          state.addressees.loading = true;
          break;
      }
    }),
    addFriendRequest: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.addressees.ids.push(payload.id);
          state.addressees.error = null;
          state.addressees.loading = false;
          break;
        case 'error':
          state.addressees.loading = false;
          state.addressees.error = payload;
          break;
        default:
          state.addressees.loading = true;
          break;
      }
    }),
    getFriendRequester: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.requesters = {
            ids: payload.map(a => a.id),
          };
          state.requesters.error = null;
          state.requesters.loading = false;
          break;
        case 'error':
          state.requesters.error = payload;
          state.requesters.loading = false;
          break;
        default:
          state.requesters.loading = true;
          break;
      }
    }),
    confirmFriendRequest: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.requesters.ids = state.addressees.ids.filter(id => id !== payload.friendship.id);
          state.getFriends.ids.push(payload.id);
          state.confirmFriendRequest = {};
          break;
        case 'error':
          state.confirmFriendRequest = { error: payload };
          break;
        default:
          state.confirmFriendRequest = { loading: true };
          break;
      }
    }),
    registerAccount: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.registerAccount = {};
          break;
        case 'error':
          state.registerAccount = { error: payload };
          break;
        default:
          state.registerAccount = { loading: true };
          break;
      }
    }),
    validateEmail: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.validateEmail = {};
          break;
        case 'error':
          state.validateEmail = { error: payload };
          break;
        default:
          state.validateEmail = { loading: true };
          break;
      }
    }),
    setPassword: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.setPassword = {};
          break;
        case 'error':
          state.setPassword = { error: payload };
          break;
        default:
          state.setPassword = { loading: true };
          break;
      }
    }),
    updateOnline: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.updateOnline = {};
          state.me.online = payload.online;
          break;
        case 'error':
          state.updateOnline = { error: payload };
          break;
        default:
          state.updateOnline = { loading: true };
          break;
      }
    }),
    login: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.me = payload;
          state.login = {};
          break;
        case 'error':
          state.login = { error: payload };
          break;
        default:
          state.login = { loading: true };
      }
    }),
    logout: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          return state;
        case 'error':
          state.logout = { error: payload };
          break;
        default:
          state.logout = { loading: true };
          break;
      }
    }),
    updateStatic: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.statics.icons = payload.icons;
          state.statics.error = null;
          state.statics.loading = false;
          break;
        case 'error':
          state.statics.error = payload;
          state.statics.loading = false;
          break;
        default:
          state.statics.loading = true;
          break;
      }
    }),
  },
  effects: {
    getMe: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getMe(payload));
      } catch (error) {
        onError(error);
      }
    },
    updateMe: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await updateMe(payload));
      } catch (error) {
        onError(error);
      }
    },
    getFriends: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getFriends(payload));
      } catch (error) {
        onError(error);
      }
    },
    getFriend: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getFriend(payload));
      } catch (error) {
        onError(error);
      }
    },
    getFriendRequestAddressees: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getFriendRequestAddressees(payload));
      } catch (error) {
        onError(error);
      }
    },
    addFriendRequest: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await addFriendRequest(payload));
      } catch (error) {
        onError(error);
      }
    },
    getFriendRequester: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getFriendRequester(payload));
      } catch (error) {
        onError(error);
      }
    },
    confirmFriendRequest: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await confirmFriendRequest(payload));
      } catch (error) {
        onError({ error, friendId: payload.friendId });
      }
    },
    registerAccount: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await registerAccount(payload));
      } catch (error) {
        onError(error);
      }
    },
    validateEmail: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await validateEmail(payload));
      } catch (error) {
        onError(error);
      }
    },
    setPassword: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await setPassword(payload));
      } catch (error) {
        onError(error);
      }
    },
    updateOnline: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await updateOnline(payload));
      } catch (error) {
        onError(error);
      }
    },
    login: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await login(payload));
      } catch (error) {
        onError(error);
      }
    },
    logout: async (_, onSuccess, onError) => {
      try {
        onSuccess(await logout());
        window.location.reload();
      } catch (error) {
        onError(error);
      }
    },
    updateStatic: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await updateStaticMe(payload));
      } catch (error) {
        onError(error);
      }
    },
  },
  actions: {
    getMe: () => ({}),
    updateMe: params => params,
    registerAccount: params => params,
    setPassword: params => params,
    validateEmail: params => params,
    updateOnline: params => params,
    login: params => params,
    logout: () => ({}),
    getFriend: id => id,
    getFriends: params => params,
    addFriendRequest: params => params,
    confirmFriendRequest: params => params,
    getFriendRequestAddressees: params => params,
    getFriendRequester: params => params,
    updateStatic: params => params,
  },
  crossReducers: {
    getMe: produce((state, payload) => {
      const data = { ...payload };
      delete data.createdAt;
      delete data.statics;
      state.user.users[payload.id] = mergeObjects([state.user.users[payload.id], data]);
    }),
    getFriend: produce((state, payload) => {
      state.user.users[payload.id] = mergeObjects([state.user.users[payload.id], payload]);
    }),
    getFriends: produce((state, payload) => {
      payload.forEach(p => {
        state.user.users[p.id] = mergeObjects([state.user.users[p.id], p]);
      });
    }),
    confirmFriendRequest: produce((state, payload) => {
      state.user.users[payload.id] = mergeObjects([state.user.users[payload.id], payload]);
    }),
    addFriendRequest: produce((state, payload) => {
      state.user.users[payload.id] = mergeObjects([state.user.users[payload.id], payload]);
    }),
    getFriendRequester: produce((state, payload) => {
      payload.forEach(p => {
        state.user.users[p.id] = mergeObjects([state.user.users[p.id], p]);
      });
    }),
  },
};

export default accountModel;
