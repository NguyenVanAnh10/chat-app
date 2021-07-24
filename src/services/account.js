import api from './api';

export const getMe = () => api.GET('/me');
export const updateStaticMe = params => api.PUT('/me/static', params);
export const updateMe = params => api.PUT('/me', params);
export const updateOnline = params => api.PUT('/online', params);
export const registerAccount = params => api.POST('/register', params);
export const validateEmail = params => api.GET('/register/validate_email', params);
export const setPassword = params => api.POST('/register/set_password', params);
export const login = params => api.POST('/login', params);
export const logout = () => api.POST('/logout');
export const getFriends = () => api.GET('/friends');
export const getFriend = id => api.GET(`/friends/${id}`);
export const addFriendRequest = params => api.POST('/friendships', params);
export const getFriendRequestAddressees = () => api.GET('/friendships/outgoing');
export const getFriendRequester = () => api.GET('/friendships/incoming');
export const confirmFriendRequest = params => api.PUT(`/friendships/${params.friendshipId}`, params);
