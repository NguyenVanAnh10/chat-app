import { getMe, login, logout, addFriend } from 'services/account';
import { getUsers, getUser } from 'services/user';

const accountModel = {
  name: 'account',
  state: {
    me: {}, // {[id]: message}
    getMe: {}, // { loading: Boolean, error: {}}
    login: {},
    logout: {},
    users: {}, // {[id]: message}
    getUsers: {}, // { loading: Boolean, error: {}}
    getUser: {}, // { loading: Boolean, error: {}}
    addFriends: {
      ids: [],
    },
    friendRequests: {
      ids: [],
    },
  },
  reducers: {
    getMe: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: payload,
            getMe: {},
          };
        case 'error':
          return { ...state, getMe: { error: payload } };
        default:
          return { ...state, getMe: { loading: true } };
      }
    },
    login: (state, { status, payload }) => {
      switch (status) {
        case 'success':
          return {
            ...state,
            me: payload,
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
              (s, u) => ({ ...s, [u._id]: u }),
              state.users,
            ),
            getUsers: { ids: payload.map(u => u._id) },
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
              [payload._id]: payload,
            },
            getUser: { id: payload._id },
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
            addFriends: {
              ids: [...state.addFriends.ids, payload._id],
            },
          };
        case 'error':
          return {
            ...state,
            addFriends: { ...state.addFriends, [payload.friendId]: { error: payload } },
          };
        default:
          return {
            ...state,
            addFriends: {
              ...state.addFriends,
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
        onError({ ...error, friendId: payload.friendId });
      }
    },
  },
  actions: {
    getMe: () => ({}),
    login: params => params,
    logout: () => ({}),
    getUsers: keyword => ({ keyword }),
    getUser: id => ({ userId: id }),
    addFriend: params => params,
  },
};

export default accountModel;
