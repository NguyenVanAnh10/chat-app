import produce from 'immer';
import { getUsers, getUser } from 'services/user';

const userModel = {
  name: 'user',
  state: {
    users: {}, // {[id]: user}
    getUsers: { ids: [] }, // { ids, loading, error}
    getUser: {}, // { loading, error}
  },
  reducers: {
    getUsers: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.users = payload.users.reduce(
            (s, u) => ({ ...s, [u.id]: u }),
            state.users,
          );
          state.getUsers[payload.keyword] = {
            ids: payload.users.map(u => u.id),
          };
          state.getUsers.loading = false;
          state.getUsers.error = null;
          break;
        case 'error':
          state.getUsers.loading = false;
          state.getUsers.error = payload;
          break;
        default:
          state.getUsers.loading = true;
          break;
      }
    }),
    getUser: produce((state, status, payload) => {
      switch (status) {
        case 'success':
          state.users[payload.id] = payload;
          state.getUser = { id: payload.id };
          break;
        case 'error':
          state.getUser = { error: payload };
          break;
        default:
          state.getUser = { loading: true };
          break;
      }
    }),
  },
  effects: {
    getUsers: async ({ cachedKey, ...payload }, onSuccess, onError) => {
      try {
        onSuccess({
          keyword: payload.keyword || cachedKey,
          users: await getUsers(payload),
        });
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
  },
  actions: {
    getUsers: params => params,
    getUser: params => params,
  },
};

export default userModel;
