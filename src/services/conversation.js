import api from './api';

export const getConversation = ({ id, ...params }) => api.GET(`/conversations/${id}`, params);
export const getConversations = () => api.GET('/conversations');
export const createConversation = params => api.POST('/conversations', params);
