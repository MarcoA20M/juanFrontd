import axios from 'axios';

const API_URL = 'http://localhost:8080/api/materials';

// Función para obtener el token del localStorage
const getAuthToken = () => {
  return localStorage.getItem('token');
};

const learningMaterialService = {
  // Obtener materiales por ID de tema
  getMaterialsByTopicId: async (topicId) => {
    try {
      const token = getAuthToken();
      const response = await axios.get(`${API_URL}/topic/${topicId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      return response.data;
    } catch (error) {
      console.error(`Error al obtener materiales del tema ${topicId}:`, error);
      throw error;
    }
  },

  // Crear nuevo material
  createMaterial: async (materialData) => {
    try {
      const token = getAuthToken();
      const response = await axios.post(API_URL, materialData, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error al crear material:', error);
      throw error;
    }
  },

  // Eliminar material
  deleteMaterial: async (materialId) => {
    try {
      const token = getAuthToken();
      await axios.delete(`${API_URL}/${materialId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
    } catch (error) {
      console.error(`Error al eliminar material ${materialId}:`, error);
      throw error;
    }
  }
};

export default learningMaterialService;