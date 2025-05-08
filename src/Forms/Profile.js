import React, { useState, useEffect } from "react";
import "../Styles/Profile.css";
import { getUserProfile, updateUserProfile } from "../services/profileService";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    maternalLastName: "",
    email: "",
    role: "",
    grade: ""
  });
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [editing, setEditing] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const userData = await getUserProfile();
        
        setProfile({
          firstName: userData.firstName || "",
          lastName: userData.lastName || "",
          maternalLastName: userData.maternalLastName || "",
          email: userData.email || "",
          role: userData.role || "",
          grade: userData.grade || ""
        });
        
        setLoading(false);
      } catch (error) {
        console.error("Error fetching profile:", error);
        setMessage("Error al cargar el perfil");
        setLoading(false);
        
        if (error.response?.status === 401) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      }
    };

    fetchUserProfile();
  }, [navigate]);

  const handleChange = (e) => {
    setProfile({
      ...profile,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updateData = {
        firstName: profile.firstName,
        lastName: profile.lastName,
        maternalLastName: profile.maternalLastName,
        grade: profile.grade
      };

      await updateUserProfile(updateData);
      setMessage("Perfil actualizado correctamente");
      setEditing(false);
      
      const updatedData = await getUserProfile();
      setProfile(prev => ({ ...prev, ...updatedData }));
      
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(error.response?.data?.message || "Error al actualizar el perfil");
    }
  };

  const handleEditToggle = () => {
    setEditing(!editing);
    setMessage("");
  };

  const handleAddSubject = () => {
    navigate("/agregar-materia");
  };
  

  if (loading) return <div className="loading">Cargando perfil...</div>;

  return (
    <div className="home-container">
      <header className="app-header">
        <div className="header-content">
          <div className="logo-container">
            <h1 className="app-title">EduPlataforma</h1>
          </div>
          <nav className="nav-menu">
          <li><a href="/homeTeacher" className="nav-link">Inicio</a></li>
          <li><a href="/grades" className="nav-link">Calificaciones</a></li>
          <li><a href="/profile" className="nav-link">Perfil</a></li>
           
          </nav>
        </div>
      </header>
      <main className="main-content">
        <form className="perfil-form" onSubmit={handleSubmit}>
          <label>
            Nombre:
            <input
              type="text"
              name="firstName"
              value={profile.firstName}
              onChange={handleChange}
              required
              disabled={!editing}
            />
          </label>
          
          <label>
            Apellido Paterno:
            <input
              type="text"
              name="lastName"
              value={profile.lastName}
              onChange={handleChange}
              required
              disabled={!editing}
            />
          </label>
          
          <label>
            Apellido Materno:
            <input
              type="text"
              name="maternalLastName"
              value={profile.maternalLastName}
              onChange={handleChange}
              disabled={!editing}
            />
          </label>
          
          <label>
            Correo electrónico:
            <input
              type="email"
              name="email"
              value={profile.email}
              disabled
            />
          </label>
          
          <label>
            Rol:
            <input
              type="text"
              value={profile.role === "TEACHER" ? "Profesor" : "Estudiante"}
              disabled
            />
          </label>
          
          {profile.role === "STUDENT" && (
            <label>
              Grado/Grupo:
              <input
                type="text"
                name="grade"
                value={profile.grade}
                onChange={handleChange}
                disabled={!editing}
              />
            </label>
          )}
          
          {profile.role === "TEACHER" && !editing && (
            <button 
              type="button" 
              onClick={handleAddSubject} 
              className="btn btn-add-subject"
            >
              Agregar Materia
            </button>
          )}

          {editing && (
            <button type="submit" className="btn">
              Guardar cambios
            </button>
          )}
          
          {message && (
            <p className={`mensaje ${message.includes("Error") ? "error" : "success"}`}>
              {message}
            </p>
          )}
        </form>
      </main>
    </div>
  );
};

export default Profile;
