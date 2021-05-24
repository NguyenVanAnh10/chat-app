import api from "./api";

export const getUsers = (params) => api.GET("/users", params);
