import { getUsers, getUser } from "services/user";

const userModel = {
  name: "user",
  state: {
    users: {}, // {[id]: message}
    getUsers: {}, // { loading: Boolean, error: {}}
    getUser: {}, // { loading: Boolean, error: {}}
  },
  reducers: {
    getUsers: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            users: payload.reduce(
              (s, u) => ({ ...s, [u._id]: u }),
              state.users
            ),
            getUsers: { ids: payload.map((u) => u._id) },
          };
        case "error":
          return { ...state, getUsers: { error: payload } };
        default:
          return { ...state, getUsers: { loading: true } };
      }
    },
    getUser: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            users: {
              ...state.users,
              [payload._id]: payload,
            },
            getUser: { id: payload._id },
          };
        case "error":
          return { ...state, getUser: { error: payload } };
        default:
          return { ...state, getUser: { loading: true } };
      }
    },
  },
  effects: {
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
  },
  actions: {
    getUsers: (keyword) => ({ keyword }),
    getUser: (id) => ({ userId: id }),
  },
};

export default userModel;
