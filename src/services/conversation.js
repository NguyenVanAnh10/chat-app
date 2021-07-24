import api from './api';

export const getConversation = id => api.GET(`/conversations/${id}`);
export const getConversations = () => api.GET('/conversations');
export const createConversation = params => api.POST('/conversations', params);
