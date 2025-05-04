import axios from 'axios';

const API_URL = "http://localhost:8080/api";

// Configuración de Axios con interceptor para el token
const api = axios.create({
  baseURL: API_URL
});

api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export const getUserProfile = async () => {
  try {
    const response = await api.get('/auth/profile');
    return response.data;
  } catch (error) {
    // Manejar específicamente el error 401 (no autorizado)
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw error;
  }
};

export const getCoursesForLoggedInStudent = async () => {
  try {
    const response = await api.get('/courses/student/logged'); // este endpoint debes tenerlo
    return response.data;
  } catch (error) {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    throw error;
  }
};


export const updateUserProfile = async (profileData) => {
  try {
    const response = await api.put('/auth/profile', profileData);
    return response.data;
  } catch (error) {
    // Procesar mensaje de error del backend si existe
    if (error.response?.data?.message) {
      throw new Error(error.response.data.message);
    }
    throw error;
  }
};