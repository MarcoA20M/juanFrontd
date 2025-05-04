const API_URL = "http://localhost:8080/api";

// Función auxiliar para manejar las solicitudes autenticadas
const authFetch = async (url, options = {}) => {
  const token = localStorage.getItem('token');
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const config = {
    ...options,
    headers
  };

  const response = await fetch(url, config);

  if (response.status === 401 || response.status === 403) {
    // Token inválido o expirado - redirigir a login
    localStorage.removeItem('token');
    window.location.href = '/login';
    throw new Error('No autorizado - Por favor inicie sesión nuevamente');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}));
    throw new Error(errorData.message || 'Error en la solicitud');
  }

  return response;
};

export const getSubjects = async () => {
  try {
    const response = await authFetch(`${API_URL}/courses`);
    return await response.json();
  } catch (error) {
    console.error("Error fetching subjects:", error);
    throw error;
  }
};

// Obtener cursos de un estudiante por su ID
export const getCoursesByStudentId = async (studentId) => {
  const response = await authFetch(`${API_URL}/courses/student/${studentId}`);
  return await response.json();
};

export const searchSubjects = async (query) => {
  try {
    const response = await authFetch(`${API_URL}/subjects/search?q=${encodeURIComponent(query)}`);
    return await response.json();
  } catch (error) {
    console.error("Error searching subjects:", error);
    throw error;
  }
};

// Función para agregar una nueva materia
export const addSubject = async (subjectData) => {
  try {
    const response = await authFetch(`${API_URL}/courses`, {
      method: 'POST',
      body: JSON.stringify(subjectData)
    });
    return await response.json();
  } catch (error) {
    console.error("Error adding subject:", error);
    throw error;
  }
};

// Función para actualizar una materia
export const updateSubject = async (id, subjectData) => {
  try {
    const response = await authFetch(`${API_URL}/courses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(subjectData)
    });
    return await response.json();
  } catch (error) {
    console.error("Error updating subject:", error);
    throw error;
  }
};

// Función para eliminar una materia
export const deleteSubject = async (id) => {
  try {
    const response = await authFetch(`${API_URL}/courses/${id}`, {
      method: 'DELETE'
    });
    return response.ok;
  } catch (error) {
    console.error("Error deleting subject:", error);
    throw error;
  }


  
};