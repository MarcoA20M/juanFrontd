import axios from "axios";

const API_URL = "http://localhost:8080/api/students"; // URL de tu backend

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    console.log('Token en los headers:', token); // Agrega esto para verificar el token
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);


// Manejo centralizado de errores de autenticación
const handleAuthError = (error) => {
  if (error.response?.status === 401) {
    localStorage.removeItem('token');
    throw new Error('Sesión expirada. Por favor inicia sesión nuevamente.');
  }
  if (error.response?.status === 403) {
    throw new Error('Acceso denegado. Verifica tus permisos.');
  }
  throw error;
};

// Crear estudiante
export const createStudent = async (studentData) => {
  try {
    const response = await api.post("/", studentData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// Obtener todos los estudiantes
export const getAllStudents = async () => {
  try {
    const response = await api.get(API_URL);
    console.log("Respuesta de la API (Estudiantes):", response.data); // Verifica la respuesta
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};


// Agregar estudiante a un curso
export const addStudentToCourse = async (idStudent, idCourse) => {
  try {
    const response = await api.post(`/add/${idStudent}/${idCourse}`);
    console.log("Respuesta al agregar estudiante al curso:", response.data);
    return response.data; // Retorna la respuesta de la API
  } catch (error) {
    handleAuthError(error);
  }
};