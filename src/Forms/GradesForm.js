import React from "react";
import { Link } from "react-router-dom";
import "../Styles/GradesForm.css";

const GradesForm = () => {
    // Simulando calificaciones (puedes reemplazarlo por datos dinámicos más adelante)
    const grades = [
        { subject: "Matemáticas", assignment: "Tarea 1", grade: 9.5 },
        { subject: "Historia", assignment: "Ensayo", grade: 8.0 },
        { subject: "Ciencias", assignment: "Proyecto", grade: 9.0 },
        { subject: "Lengua", assignment: "Resumen", grade: 10.0 },
    ];

    return (
        <div className="grades-form-wrapper">
            <nav className="navbar">
                <div className="search-container">
                    <input type="text" placeholder="Buscar materia..." className="search-input" />
                </div>
                <ul className="navbar-links">
                    <li><Link to="/home">Inicio</Link></li>
                    <li><Link to="/grades">Calificaciones</Link></li>
                    <li><a href="#">Perfil</a></li>
                </ul>
            </nav>

            <div className="grades-form-card">
                <h2 className="grades-title">📊 Calificaciones</h2>

                <table className="grades-table">
                    <thead>
                        <tr>
                            <th>Materia</th>
                            <th>Actividad</th>
                            <th>Calificación</th>
                        </tr>
                    </thead>
                    <tbody>
                        {grades.map((item, index) => (
                            <tr key={index}>
                                <td>{item.subject}</td>
                                <td>{item.assignment}</td>
                                <td>{item.grade}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default GradesForm;
