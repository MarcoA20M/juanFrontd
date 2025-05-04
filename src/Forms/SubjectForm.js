import React from "react";
import { useParams } from "react-router-dom";
import "../Styles/SubjectForm.css";

const SubjectForm = () => {
    const { nombre } = useParams();

    return (
        <div className="subject-form-wrapper">
            <nav className="navbar">
                <div className="search-container">
                    <input type="text" placeholder="Buscar materia..." className="search-input" />
                </div>
                <ul className="navbar-links">
                    <li><a href="/home">Inicio</a></li>
                    <li><a href="#">Calificaciones</a></li>
                    <li><a href="#">Perfil</a></li>
                </ul>
               
            </nav>

            <div className="subject-form-card">
                <h2 className="subject-title">Materia: {nombre}</h2>

                <div className="section">
                    <h3 className="section-title">📘 Tarea 1: Ejercicio de repaso</h3>
                    <p className="section-desc">Sube tu tarea de ejercicios antes del viernes.</p>
                    <form className="form">
                        <label className="form-label">Comentario:</label>
                        <textarea className="form-textarea" rows="4" placeholder="Escribe algo sobre tu entrega..." />
                        <input type="file" className="form-file" />
                        <button type="submit" className="form-btn">Enviar tarea</button>
                    </form>
                </div>

                <div className="section">
                    <h3 className="section-title">📎 Material de apoyo</h3>
                    <p className="section-desc">Consulta los materiales proporcionados por el docente.</p>
                    <ul className="material-list">
                        <li><a href="#">📄 Guía de estudio - Semana 1</a></li>
                        <li><a href="#">📄 Lectura complementaria</a></li>
                    </ul>
                </div>

                <div className="section">
                    <h3 className="section-title">💬 Foro de discusión</h3>
                    <p className="section-desc">Participa respondiendo a la siguiente pregunta: ¿Qué te pareció el tema de esta semana?</p>
                    <form className="form">
                        <textarea className="form-textarea" rows="3" placeholder="Escribe tu participación..." />
                        <button type="submit" className="form-btn">Publicar en foro</button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default SubjectForm;
