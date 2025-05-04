import React, { useState } from "react";
import { createCourse } from "../services/courseService";
import "../Styles/AddCourseForm.css";
import { useNavigate } from "react-router-dom";

const AddCourseForm = () => {
  const [course, setCourse] = useState({
    name: "",
    description: "",
  });

  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCourse({
      ...course,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await createCourse(course); // El backend debe asociar el teacher automáticamente por el token
      setMessage("Materia creada exitosamente.");
      navigate("/materias"); // Redirige a la lista de materias
    } catch (error) {
      console.error("Error creando materia:", error);
      setMessage("Error al crear la materia.");
    }
  };

  return (
    <div className="add-course-container">
      <h2>Agregar Nueva Materia</h2>
      <form className="add-course-form" onSubmit={handleSubmit}>
        <label>
          Nombre de la materia:
          <input
            type="text"
            name="name"
            value={course.name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Descripción:
          <textarea
            name="description"
            value={course.description}
            onChange={handleChange}
          />
        </label>

        <button type="submit" className="btn">
          Crear Materia
        </button>

        {message && (
          <p className={`message ${message.includes("Error") ? "error" : "success"}`}>
            {message}
          </p>
        )}
      </form>
    </div>
  );
};

export default AddCourseForm;
