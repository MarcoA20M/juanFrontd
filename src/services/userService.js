import axios from "axios";

// URL de tu API backend
const API_URL = "http://localhost:8080/api/users";  // Ajusta según la URL de tu backend

// Crear un nuevo usuario
export const createUser = async (userData) => {
  try {
    const response = await axios.post(API_URL, userData);
    return response.data;  // Mensaje de éxito enviado por el backend
  } catch (error) {
    throw new Error(error.response?.data || "Error al crear el usuario");
  }
};

// Iniciar sesión de usuario
export const loginUser = async (userData) => {
  try {
    const response = await axios.post(`${API_URL}/login`, userData);  // Ajusta la ruta de login si es necesario
    return response.data;  // Datos de respuesta, puede incluir un token u otro tipo de respuesta
  } catch (error) {
    throw new Error(error.response?.data || "Error al iniciar sesión");
  }
};
