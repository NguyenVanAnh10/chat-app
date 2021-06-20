import api from './api';

export const getMe = () => api.GET('/me');
export const updateMe = params => api.POST('/me', params);
export const login = params => api.POST('/login', params);
export const logout = () => api.POST('/logout');
export const addFriend = ({ userId, ...params }) => api.POST(`/users/${userId}/friends`, params);
export const confirmFriendRequest = params => api.POST(`/users/${params.userId}/friends/${params.friendId}`, params);
export const getFriendRequest = params => api.GET(`/users/${params.userId}/friends/${params.friendId}/friend-request`);
export const getFriends = ({ userId, ...params }) => api.GET(`/users/${userId}/friends`, params);
