import api from './api';

export const getMessages = params => api.GET('/messages', params);
export const getMessage = ({ messageId, ...params }) => api.GET(`/messages/${messageId}`, params);
export const sendMessage = params => api.POST('/messages', params);
export const seenMessages = params => api.POST('/messages/seen', params);
export const getUnseenMessages = params => api.GET('/messages/unseen', params);
