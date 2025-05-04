import axios from "axios";

const API_URL = "http://localhost:8080/api/students";  // URL de tu backend

export const createStudent = async (studentData) => {
    try {
      const response = await axios.post(`${API_URL}`, studentData);
      return response.data;
    } catch (error) {
      throw new Error('Error al crear estudiante: ' + error.message);
    }
  };