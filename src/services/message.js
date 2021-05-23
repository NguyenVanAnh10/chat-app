import api from "./api";

export const getMessages = (params) => api.GET("/messages", params);
export const getMessage = ({ messageId, ...params }) =>
  api.GET(`/messages/${messageId}`, params);
export const getRoom = ({ roomId, userId }) =>
  api.GET(`/chat_rooms/${roomId}`, {
    userId,
  });
export const getRooms = (userId) =>
  api.GET("/chat_rooms", {
    userId,
  });
export const sendMessage = (params) => api.POST("/messages", params);
export const haveSeenMessages = (params) => api.POST(`/messages/seen`, params);
