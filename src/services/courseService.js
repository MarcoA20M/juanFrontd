import axios from 'axios';

const API_URL = "http://localhost:8080/api";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Interceptor para añadir el token automáticamente
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
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

// Cursos para estudiantes
export const getStudentCourses = async () => {
  try {
    const response = await api.get('/courses/my-courses');
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const searchStudentCourses = async (query) => {
  try {
    const response = await api.get('/courses/my-courses/search', {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// Cursos para profesores
export const getStudentCoursesP = async () => {
  try {
    const response = await api.get('/courses/my-courses/p');
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// Búsqueda de cursos del profesor
export const searchTeacherCourses = async (teacherId, query) => {
  if (!teacherId) {
    const storedUser = JSON.parse(localStorage.getItem('user'));
    teacherId = storedUser?.id;
  }
  if (!teacherId) {
    throw new Error('teacherId es requerido para la búsqueda de cursos del profesor');
  }
  try {
    const response = await api.get(`/courses/teacher/${teacherId}/search`, {
      params: { q: query }
    });
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

// Crear curso (para profesor)
export const createCourse = async (courseData) => {
  try {
    const response = await api.post('/courses', courseData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
  }
};

export const addStudentToCourse = async (idStudent, idCourse) => {
  const token = localStorage.getItem('token'); // Asegúrate de que el token está en el localStorage
  try {
    const response = await axios.post(`${API_URL}/add`, null, {
      headers: {
        'Authorization': `Bearer ${token}`, // Aquí agregamos el token
      },
      params: {
        idStudent: idStudent,
        idCourse: idCourse,
      },
    });
    return response.data; // Retorna la respuesta de la API
  } catch (error) {
    // Manejo de errores
    throw new Error(error.response?.data?.message || "Error al agregar el estudiante al curso");
  }
};

// api.js (or your API service file)

export const createTopic = async (courseId, topicData) => {
  try {
    // Debug: Check what you're actually passing
    console.log("Course ID:", courseId); // Should be a number like 1, 2, etc.
    //console.log("Type of courseId:", typeof courseId); // Should be "number" or "string"

    // Extract ID if an object was accidentally passed
    const id = typeof courseId === 'object' ? courseId.id : courseId;
    
    const response = await api.post(`/courses/${id}/topics`, topicData);



    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error; // Propagate error to the UI
  }
};

export const createTopic2 = async (courseId, topicData) => {
  try {
    const response = await api.post(`/courses/${courseId}/topics`, topicData);
    return response.data;
  } catch (error) {
    handleAuthError(error);
    throw error;
  }
};

