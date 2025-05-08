import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/api";
import "../Styles/Login.css";

const Login = () => {
    const [userData, setUserData] = useState({
        email: "",  // Cambiado de nombreUsuario a email
        password: "", // Cambiado de clave a password
    });
    const [message, setMessage] = useState("");
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser(userData); // Llamada al backend
            
            // Guardar el token y datos del usuario en localStorage
            localStorage.setItem("token", response.token);
            localStorage.setItem("userEmail", response.email);
            localStorage.setItem("userRole", response.role);

            setMessage(`Bienvenido, ${response.email}`);

            // Redirigir según el rol del usuario
            if (response.role === "TEACHER") {
                navigate("/homeTeacher");
            } else {
                navigate("/home");
            }
        } catch (error) {
            setMessage(error.response?.data?.message || "Error al iniciar sesión");
            console.error("Login error:", error);
        }
    };

    const handleRegisterRedirect = () => {
        navigate("/register");
    };

    return (
        <div className="container">
            <div className="form-container">
                <h2 className="title">Iniciar Sesión</h2>
                <form onSubmit={handleLogin}>
                    <input
                        type="email"
                        placeholder="Correo electrónico"
                        className="input-field"
                        onChange={(e) => setUserData({ ...userData, email: e.target.value })}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Contraseña"
                        className="input-field"
                        onChange={(e) => setUserData({ ...userData, password: e.target.value })}
                        required
                    />
                    <button type="submit" className="btn">Entrar</button>
                </form>
                <p className="toggle-link" onClick={handleRegisterRedirect}>
                    <span className="link-text">¿No tienes cuenta? Regístrate</span>
                </p>
                {message && <p className="message">{message}</p>}
            </div>
        </div>
    );
};

export default Login;