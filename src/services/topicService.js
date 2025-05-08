import axios from 'axios';

const API_URL = "http://localhost:8080/api/topics";

// Crear instancia de Axios
const api = axios.create({
  baseURL: API_URL,
  timeout: 10000, // 10 segundos de timeout
});

// Interceptor para añadir el token de autenticación
api.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

// Interceptor para manejar errores globales
api.interceptors.response.use(
  response => response,
  error => {
    if (error.response?.status === 401) {
      // Token inválido o expirado
      localStorage.removeItem('token');
      window.location.href = '/login'; // Redirigir a login
    }
    return Promise.reject(error);
  }
);

const topicService = {
  /**
   * Obtener todos los temas (solo admin)
   */
  getAllTopics: async () => {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Error fetching topics:', error);
      throw new Error(error.response?.data?.message || 'Error al obtener los temas');
    }
  },

  /**
   * Obtener temas por ID de curso
   * @param {number} idCourse - ID del curso
   */
  getTopicsByCourseId: async (idCourse) => {
    try {
      const response = await api.get(`/course/${idCourse}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching topics for course ${idCourse}:`, error);
      
      // Mensajes personalizados según el código de error
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para ver estos temas');
      }
      if (error.response?.status === 404) {
        throw new Error('Curso no encontrado');
      }
      
      throw new Error(error.response?.data?.message || 'Error al obtener los temas del curso');
    }
  },

  /**
   * Obtener un tema específico por ID
   * @param {number} idTopic - ID del tema
   */
  getTopicById: async (idTopic) => {
    try {
      const response = await api.get(`/${idTopic}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching topic ${idTopic}:`, error);
      
      if (error.response?.status === 404) {
        throw new Error('Tema no encontrado');
      }
      
      throw new Error(error.response?.data?.message || 'Error al obtener el tema');
    }
  },

  /**
   * Guardar o actualizar un tema
   * @param {Object} topic - Datos del tema
   */
  saveTopic: async (topic) => {
    try {
      const method = topic.idTopic ? 'put' : 'post';
      const url = topic.idTopic ? `/${topic.idTopic}` : '/';
      
      const response = await api({
        method,
        url,
        data: topic,
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      return response.data;
    } catch (error) {
      console.error('Error saving topic:', error);
      
      if (error.response?.status === 400) {
        throw new Error('Datos del tema inválidos');
      }
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para modificar temas');
      }
      
      throw new Error(error.response?.data?.message || 'Error al guardar el tema');
    }
  },

  /**
   * Eliminar un tema
   * @param {number} idTopic - ID del tema a eliminar
   */
  deleteTopic: async (idTopic) => {
    try {
      await api.delete(`/${idTopic}`);
    } catch (error) {
      console.error(`Error deleting topic ${idTopic}:`, error);
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para eliminar temas');
      }
      if (error.response?.status === 404) {
        throw new Error('Tema no encontrado');
      }
      
      throw new Error(error.response?.data?.message || 'Error al eliminar el tema');
    }
  },

  /**
   * Enviar una tarea (submission)
   * @param {number} topicId - ID del tema
   * @param {FormData} formData - Datos del formulario (comentario + archivo)
   */
  submitAssignment: async (topicId, formData) => {
    try {
      const response = await api.post(`/${topicId}/submissions`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error submitting assignment for topic ${topicId}:`, error);
      
      if (error.response?.status === 403) {
        throw new Error('No tienes permisos para enviar esta tarea');
      }
      if (error.response?.status === 400) {
        throw new Error('Formato de archivo no válido o tamaño excedido');
      }
      
      throw new Error(error.response?.data?.message || 'Error al enviar la tarea');
    }
  }
};

export default topicService;
