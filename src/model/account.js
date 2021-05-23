import services from "services/account";

const accountModel = {
  name: "account",
  state: {
    me: {}, // {[id]: message}
    getMe: {}, // { loading: Boolean, error: {}}
    login: {},
    logout: {},
  },
  reducers: {
    getMe: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            me: payload,
            getMe: {},
          };
        case "error":
          return { ...state, getMe: { error: payload } };
        default:
          return { ...state, getMe: { loading: true } };
      }
    },
    login: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return {
            ...state,
            me: payload,
            login: {},
          };
        case "error":
          return { ...state, login: { error: payload } };
        default:
          return { ...state, login: { loading: true } };
      }
    },
    logout: (state, { status, payload }) => {
      switch (status) {
        case "success":
          return state;
        case "error":
          return { ...state, logout: { error: payload } };
        default:
          return { ...state, logout: { loading: true } };
      }
    },
  },
  effects: {
    getMe: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await services.getMe(payload));
      } catch (error) {
        onError(error);
      }
    },
    login: async (payload, onSuccess, onError) => {
      try {
        onSuccess(await services.login(payload));
      } catch (error) {
        onError(error);
      }
    },
    logout: async (_, onSuccess, onError) => {
      try {
        onSuccess(await services.logout());
        window.location.reload();
      } catch (error) {
        onError(error);
      }
    },
  },
  actions: {
    getMe: () => ({}),
    login: (params) => params,
    logout: () => ({}),
  },
};

export default accountModel;
