import api from './api';

export const getUsers = params => api.GET('/users', params);
export const getUser = params => api.GET(`/users/${params.id}`);
