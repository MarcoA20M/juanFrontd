import React, { useState } from "react";
import { createCourse } from "../services/courseService";
import "../Styles/AddCourseForm.css";
import { useNavigate } from "react-router-dom";

const AddCourseForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    teacherId: "" // En un sistema real, esto vendría del usuario autenticado o de otra fuente
  });

  const [message, setMessage] = useState({ text: "", type: "" });
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage({ text: "", type: "" });

    try {
      // Validación básica
      if (!formData.name.trim()) {
        throw new Error("El nombre del curso es requerido");
      }

      // En un sistema real, el teacherId debería obtenerse del usuario autenticado
      // o de otra fuente segura, no del formulario
      const courseData = {
        name: formData.name.trim(),
        description: formData.description.trim(),
        teacher: { idTeacher: 1 } // Valor temporal - debería venir del contexto/auth
      };

      await createCourse(courseData);
      setMessage({ 
        text: "Curso creado exitosamente", 
        type: "success" 
      });
      
      setTimeout(() => navigate("/courses"), 1500);
    } catch (error) {
      console.error("Error al crear curso:", error);
      setMessage({
        text: error.response?.data?.message || error.message || "Error al crear el curso",
        type: "error"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="add-course-container">
      <h2>Agregar Nuevo Curso</h2>
      
      <form onSubmit={handleSubmit} className="add-course-form">
        {/* Nombre del Curso */}
        <div className="form-group">
          <label htmlFor="name">Nombre del Curso*</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            maxLength="100"
            placeholder="Ej: Matemáticas Avanzadas"
            disabled={isLoading}
          />
        </div>

        {/* Descripción */}
        <div className="form-group">
          <label htmlFor="description">Descripción</label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            rows="4"
            maxLength="500"
            placeholder="Descripción del curso..."
            disabled={isLoading}
          />
        </div>

        {/* Acciones del Formulario */}
        <div className="form-actions">
          <button
            type="submit"
            className={`btn primary ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? "Creando..." : "Crear Curso"}
          </button>
          
          <button
            type="button"
            className="btn secondary"
            onClick={() => navigate(-1)}
            disabled={isLoading}
          >
            Cancelar
          </button>
        </div>

        {/* Mensajes de Feedback */}
        {message.text && (
          <div className={`message ${message.type}`}>
            {message.text}
          </div>
        )}
      </form>
    </div>
  );
};

export default AddCourseForm;