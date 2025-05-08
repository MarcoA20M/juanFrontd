import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TasksList = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Fetch tasks from backend API
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('/api/assignments/submissions'); // Endpoint para obtener tareas enviadas
        setTasks(response.data);
      } catch (err) {
        setError('Error fetching tasks');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h2>Enviadas por los Estudiantes</h2>
      <table>
        <thead>
          <tr>
            <th>Título</th>
            <th>Estudiante</th>
            <th>Fecha de Envío</th>
            <th>Acción</th>
          </tr>
        </thead>
        <tbody>
          {tasks.map(task => (
            <tr key={task.id}>
              <td>{task.title}</td>
              <td>{task.studentName}</td>
              <td>{task.submissionDate}</td>
              <td>
                <button onClick={() => handleGrade(task.id)}>Calificar</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  // Función para calificar la tarea
  const handleGrade = (taskId) => {
    // Aquí podrías redirigir a una página de calificación o mostrar un modal
    console.log(`Calificando tarea con ID: ${taskId}`);
  };
};

export default TasksList;
