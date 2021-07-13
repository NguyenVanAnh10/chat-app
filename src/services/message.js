import api from './api';

export const getMessages = params => api.GET('/messages', params);
export const getMessage = ({ messageId, ...params }) => api.GET(`/messages/${messageId}`, params);
export const getConversation = ({ conversationId, userId }) => api.GET(`/chat_conversations/${conversationId}`, {
  userId,
});
export const getConversations = userId => api.GET('/chat_conversations', {
  userId,
});
export const createConversation = params => api.POST('/chat_conversations', params);
export const sendMessage = params => api.POST('/messages', params);
export const haveSeenMessages = params => api.POST('/messages/seen', params);
