import axios from 'axios';

const API_URL = 'http://localhost:8080/api/assignments';

const getAuthToken = () => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.warn('No se encontró token de autenticación');
        throw new Error('No autenticado');
    }
    return token;
};

const handleApiError = (error) => {
    let errorMessage = 'Error en la solicitud';
    if (error.response) {
        errorMessage = error.response.data?.message || 
                      `Error ${error.response.status}: ${error.response.statusText}`;
    } else if (error.request) {
        errorMessage = 'No se recibió respuesta del servidor';
    } else {
        errorMessage = error.message;
    }
    console.error('Error en el servicio:', errorMessage);
    throw new Error(errorMessage);
};

const validateAssignmentData = (data) => {
    if (!data) throw new Error('Datos de asignación requeridos');
    if (!data.topicId) throw new Error('Selecciona un tema para la tarea');
    if (!data.title?.trim()) throw new Error('El título es requerido');
    if (!data.dueDate) throw new Error('La fecha de entrega es requerida');
};

const getAssignmentsByTopic = async (topicId) => {
    try {
        const response = await axios.get(`${API_URL}/topic/${topicId}`, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

const addAssignment = async (assignmentData) => {
    try {
        validateAssignmentData(assignmentData);
        
        const payload = {
            title: assignmentData.title.trim(),
            description: assignmentData.description?.trim() || null,
            dueDate: new Date(assignmentData.dueDate).toISOString(),
            topicId: assignmentData.topicId
        };

        const response = await axios.post(API_URL, payload, {
            headers: {
                'Authorization': `Bearer ${getAuthToken()}`,
                'Content-Type': 'application/json'
            }
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export default {
    getAssignmentsByTopic,
    addAssignment
};