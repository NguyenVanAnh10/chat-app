import api from './api';

export const getMe = () => api.GET('/me');
export const login = params => api.POST('/login', params);
export const logout = () => api.POST('/logout');
export const addFriend = ({ userId, ...params }) => api.POST(`/users/${userId}/friends`, params);
