import {
  getMe, login, logout, addFriend, confirmFriendRequest, getFriendRequest, updateMe,
} from 'services/account';
import { getUsers, getUser } from 'services/user';

const accountModel = {
  name: 'account',
  state: {
    me: {
      friendIds: [],
      addFriends: [],
      friendRequests: [],
    },
    addFriend: {}, // {[id]: { loading, error}}
    confirmFriendRequest: {}, // {[id]: { loading, error}}
    getMe: {}, // { loading, error}
    updateMe: {},
    login: {},
    logout: {},
    users: {}, // {[id]: message}
    getUsers: {}, // { loading, error}
    getUser: {}, // { loading, error}

  },
  reducers: {
    getMe: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: { ...state.me, ...payload },
            getMe: {},
          };
        case 'error':
          return { ...state, getMe: { error: payload } };
        default:
          return { ...state, getMe: { loading: true } };
      }
    },
    updateMe: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: { ...state.me, ...payload },
            updateMe: {},
          };
        case 'error':
          return { ...state, updateMe: { error: payload } };
        default:
          return { ...state, updateMe: { loading: true } };
      }
    },
    login: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: { ...state.me, ...payload },
            login: {},
          };
        case 'error':
          return { ...state, login: { error: payload } };
        default:
          return { ...state, login: { loading: true } };
      }
    },
    logout: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return state;
        case 'error':
          return { ...state, logout: { error: payload } };
        default:
          return { ...state, logout: { loading: true } };
      }
    },
    getUsers: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            users: payload.reduce(
              (s, u) => ({ ...s, [u.id]: u }),
              state.users,
            ),
            getUsers: { ids: payload.map(u => u.id) },
          };
        case 'error':
          return { ...state, getUsers: { error: payload } };
        default:
          return { ...state, getUsers: { loading: true } };
      }
    },
    getUser: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            users: {
              ...state.users,
              [payload.id]: payload,
            },
            getUser: { id: payload.id },
          };
        case 'error':
          return { ...state, getUser: { error: payload } };
        default:
          return { ...state, getUser: { loading: true } };
      }
    },
    addFriend: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: {
              ...state.me,
              addFriends: [...state.me.addFriends, payload],
            },
            addFriend: {},
          };
        case 'error':
          return {
            ...state,
            addFriend: { [payload.friendId]: { error: payload.error } },
          };
        default:
          return {
            ...state,
            addFriend: {
              [payload.friendId]: { loading: true },
            },
          };
      }
    },
    confirmFriendRequest: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: {
              ...state.me,
              friendIds: [...state.me.friendIds, payload.friendId],
              friendRequests: state.me.friendRequests.filter(f => f.friendId !== payload.friendId),
            },
            confirmFriendRequest: {},
          };
        case 'error':
          return {
            ...state,
            confirmFriendRequest: { [payload.friendId]: { error: payload.error } },
          };
        default:
          return {
            ...state,
            confirmFriendRequest: {
              [payload.friendId]: { loading: true },
            },
          };
      }
    },
    getFriendRequest: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: {
              ...state.me,
              friendRequests: [...state.me.friendRequests, payload],
            },
            getFriendRequest: {},
          };
        case 'error':
          return {
            ...state,
            getFriendRequest: { [payload.friendId]: { error: payload.error } },
          };
        default:
          return {
            ...state,
            getFriendRequest: {
              [payload.friendId]: { loading: true },
            },
          };
      }
    },
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
    getUsers: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getUsers(payload));
      } catch (error) {
        onError(error);
      }
    },
    getUser: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getUser(payload));
      } catch (error) {
        onError(error);
      }
    },
    addFriend: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await addFriend(payload));
      } catch (error) {
        onError({ error, friendId: payload.friendId });
      }
    },
    confirmFriendRequest: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await confirmFriendRequest(payload));
      } catch (error) {
        onError({ error, friendId: payload.friendId });
      }
    },
    getFriendRequest: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getFriendRequest(payload));
      } catch (error) {
        onError({ error, friendId: payload.friendId });
      }
    },
  },
  actions: {
    getMe: () => ({}),
    updateMe: params => params,
    login: params => params,
    logout: () => ({}),
    getUsers: keyword => ({ keyword }),
    getUser: id => ({ userId: id }),
    addFriend: params => params,
    confirmFriendRequest: params => params,
    getFriendRequest: params => params,
  },
};

export default accountModel;
