import { getUsers } from "services/user";

const userModel = {
  name: "user",
  state: {
    users: {}, // {[id]: message}
    getUsers: {}, // { loading: Boolean, error: {}}
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
  },
  effects: {
    getUsers: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await getUsers(payload));
      } catch (error) {
        onError(error);
      }
    },
  },
  actions: {
    getUsers: (keyword) => ({ keyword }),
  },
};

export default userModel;
