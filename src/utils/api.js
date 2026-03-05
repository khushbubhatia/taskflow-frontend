import axios from 'axios';

const API_URL = 'https://taskflow-production-6baf.up.railway.app';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const register = async (userData) => {
  const response = await api.post('/auth/register', userData);
  return response.data;
};

export const login = async (userData) => {
  const response = await api.post('/auth/login', userData);
  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get('/auth/me');
  return response.data;
};
export const deleteAccount = async () => {
  const response = await api.delete('/auth/me');
  return response.data;
};

export const getBoards = async () => {
  const response = await api.get('/boards');
  return response.data;
};

export const getBoard = async (id) => {
  const response = await api.get(`/boards/${id}`);
  return response.data;
};

export const createBoard = async (boardData) => {
  const response = await api.post('/boards', boardData);
  return response.data;
};

export const updateBoard = async (id, boardData) => {
  const response = await api.put(`/boards/${id}`, boardData);
  return response.data;
};

export const deleteBoard = async (id) => {
  const response = await api.delete(`/boards/${id}`);
  return response.data;
};

export const getTasks = async (boardId) => {
  const response = await api.get(`/tasks/${boardId}`);
  return response.data;
};

export const createTask = async (taskData) => {
  const response = await api.post('/tasks', taskData);
  return response.data;
};

export const updateTask = async (id, taskData) => {
  const response = await api.put(`/tasks/${id}`, taskData);
  return response.data;
};

export const moveTask = async (id, moveData) => {
  const response = await api.put(`/tasks/${id}/move`, moveData);
  return response.data;
};

export const deleteTask = async (id) => {
  const response = await api.delete(`/tasks/${id}`);
  return response.data;
};

export const getSuggestion = async (boardId) => {
  const response = await api.post('/ai/suggest', { boardId });
  return response.data;
};

export default api;