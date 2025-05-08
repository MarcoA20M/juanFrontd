import axios from 'axios';

// URL base de tu backend
const API_URL = 'http://localhost:8080'; // Cambia esta URL según sea necesario

// Función para agregar un estudiante a un curso
export const addStudentToCourse = async (idStudent, idCourse) => {
    const token = localStorage.getItem('token'); // Asegúrate de que el token está en el localStorage

    // Verificar si el token está presente
    if (!token) {
        throw new Error("Token no encontrado en el almacenamiento local");
    }

    try {
        // Usamos @PathVariable, por lo tanto, los parámetros van directamente en la URL
        const response = await axios.post(`${API_URL}/api/students/add/${idStudent}/${idCourse}`, null, {
            headers: {
                'Authorization': `Bearer ${token}`, // Aquí agregamos el token
            },
        });
        return response.data; // Retorna la respuesta de la API
    } catch (error) {
        // Manejo de errores: verificamos si hay una respuesta de error y proporcionamos un mensaje adecuado
        console.error('Error al hacer la solicitud:', error); // Log para depurar
        throw new Error(error.response?.data?.message || "Error al agregar el estudiante al curso");
    }
};
