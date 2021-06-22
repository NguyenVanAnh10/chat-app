import api from './api';

export default {
  getMe: () => api.GET('/me'),
  updateMe: params => api.POST('/me', params),
  register: params => api.POST('/register', params),
  validateEmail: params => api.GET('/register/validate_email', params),
  setPassword: params => api.POST('/register/set_password', params),
  login: params => api.POST('/login', params),
  logout: () => api.POST('/logout'),
  addFriend: ({ userId, ...params }) => api.POST(`/users/${userId}/friends`, params),
  confirmFriendRequest: params => api.POST(`/users/${params.userId}/friends/${params.friendId}`, params),
  getFriendRequest: params => api.GET(`/users/${params.userId}/friends/${params.friendId}/friend-request`),
  getFriends: ({ userId, ...params }) => api.GET(`/users/${userId}/friends`, params),
};
