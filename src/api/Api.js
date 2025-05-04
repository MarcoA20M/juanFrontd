import axios from "axios";

const API_URL = "http://localhost:8080/api"; // Cambia según tu backend

export const getStudents = async () => {
  try {
    const response = await axios.get(`${API_URL}/students`);
    return response.data;
  } catch (error) {
    console.error("Error fetching students:", error);
    return [];
  }
};
