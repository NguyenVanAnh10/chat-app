import api from './api';

const getMe = () => api.GET('/me');
const login = params => api.POST('/login', params);
const logout = () => api.POST('/logout');

const services = { getMe, login, logout };
export default services;
