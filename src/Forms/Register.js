import React, { useState } from "react";
import "../Styles/Register.css";

const Register = () => {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        maternalLastName: "",
        email: "",
        password: "",
        role: "STUDENT",
        dateOfBirth: "",
        gradeLevel: "",
        specialty: "",
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const userPayload = {
            firstName: formData.firstName,
            lastName: formData.lastName,
            maternalLastName: formData.maternalLastName,
            email: formData.email,
            password: formData.password,
            role: formData.role,
            dateOfBirth: formData.role === "STUDENT" ? formData.dateOfBirth : null,
            gradeLevel: formData.role === "STUDENT" ? formData.gradeLevel : null,
            specialty: formData.role === "TEACHER" ? formData.specialty : null,
        };

        try {
            const response = await fetch("http://localhost:8080/api/auth/register", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(userPayload),
            });

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error("Error al registrar usuario: " + errorData);
            }

            alert("Registro exitoso");
        } catch (error) {
            console.error("Error en el registro:", error);
            alert("Error en el registro: " + error.message);
        }
    };

    return (
        <div className="register-container">
            <h2>Crear una Cuenta</h2>
            <form onSubmit={handleSubmit} className="register-form">
                <input type="text" name="firstName" placeholder="Nombre" onChange={handleChange} required className="form-input" />
                <input type="text" name="lastName" placeholder="Apellido Paterno" onChange={handleChange} required className="form-input" />
                <input type="text" name="maternalLastName" placeholder="Apellido Materno" onChange={handleChange} className="form-input" />
                <input type="email" name="email" placeholder="Correo electrónico" onChange={handleChange} required className="form-input" />
                <input type="password" name="password" placeholder="Contraseña" onChange={handleChange} required className="form-input" />

                <select name="role" value={formData.role} onChange={handleChange} required className="form-select">
                    <option value="STUDENT">Estudiante</option>
                    <option value="TEACHER">Maestro</option>
                </select>

                {formData.role === "STUDENT" && (
                    <>
                        <input type="date" name="dateOfBirth" onChange={handleChange} required placeholder="Fecha de nacimiento" className="form-input" />
                        <input type="text" name="gradeLevel" onChange={handleChange} required placeholder="Grado" className="form-input" />
                    </>
                )}

                {formData.role === "TEACHER" && (
                    <input type="text" name="specialty" onChange={handleChange} required placeholder="Especialidad" className="form-input" />
                )}

                <button type="submit" className="form-button">Registrar</button>
            </form>
        </div>
    );
};

export default Register;
