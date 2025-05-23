import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentCourses, searchStudentCourses } from "../services/courseService";
import "../Styles/Home.css";

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No autenticado. Redirigiendo a login...');
        }

        const data = await getStudentCourses();
        console.log("Datos recibidos:", data);
        
        // Normalización de datos (por si el backend devuelve objeto o array)
        const coursesArray = Array.isArray(data) ? data : data ? [data] : [];
        
        setSubjects(coursesArray);
        setFilteredSubjects(coursesArray);
        
        if (coursesArray.length === 0) {
          console.warn("El usuario no tiene materias asignadas");
        }
      } catch (err) {
        console.error("Error al cargar materias:", err);
        setError(err.response?.data?.message || err.message);
        
        if (err.response?.status === 401 || err.message.includes('No autenticado')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStudentCourses();
  }, [navigate]);

  const handleSearch = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      if (!searchQuery.trim()) {
        setFilteredSubjects(subjects);
        return;
      }

      const results = await searchStudentCourses(searchQuery);
      setFilteredSubjects(Array.isArray(results) ? results : results ? [results] : []);
    } catch (err) {
      console.error("Error en búsqueda:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEnter = (subjectId) => {
    navigate(`/materia/${subjectId}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setSearchQuery("");
    window.location.reload();
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="spinner"></div>
        <p>Cargando tus materias...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-alert">
          <h3>Error</h3>
          <p>{error}</p>
          <button onClick={handleRefresh} className="retry-button">
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="nav-brand">Plataforma Educativa</div>
        
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar materia..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              disabled={loading}
            />
            <button 
              type="submit" 
              className="search-button"
              disabled={loading}
            >
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>
        
        <ul className="nav-menu">
          <li><a href="/home" className="nav-link active">Inicio</a></li>
          <li><a href="/grades" className="nav-link">Calificaciones</a></li>
          <li><a href="/profile" className="nav-link">Perfil</a></li>
          <li>
            <button 
              onClick={() => {
                localStorage.removeItem('token');
                navigate('/login');
              }}
              className="logout-button"
            >
              Cerrar sesión
            </button>
          </li>
        </ul>
      </nav>

      <header className="header">
        <h1>Mis Materias</h1>
        <p className="subtitle">Bienvenido a tu panel de aprendizaje</p>
      </header>

      <main className="main-content">
        {filteredSubjects.length === 0 ? (
          <div className="empty-state">
            <img 
              src="/images/no-courses.svg" 
              alt="No hay materias" 
              className="empty-image"
            />
            <h3>No tienes materias asignadas</h3>
            <p>Actualmente no estás inscrito en ninguna materia.</p>
            <button 
              onClick={handleRefresh}
              className="primary-button"
            >
              Actualizar
            </button>
          </div>
        ) : (
          <div className="subject-grid">
            {filteredSubjects.map((subject) => {
              const subjectId = subject.idCourse || subject.id;
              return (
                <div className="subject-card" key={subjectId}>
                  <div className="subject-header">
                    <h3>{subject.name || 'Nombre no disponible'}</h3>
                    <span className="subject-code">{subject.code || 'N/A'}</span>
                  </div>
                  
                  <p className="subject-description">
                    {subject.description || 'Descripción no disponible'}
                  </p>
                  
                  <div className="subject-footer">
                    <div className="teacher-info">
                      <span className="label">Profesor:</span>
                      {subject.teacher ? (
                        <span>{subject.teacher.firstName} {subject.teacher.lastName}</span>
                      ) : (
                        <span>No asignado</span>
                      )}
                    </div>
                    
                    <button 
                      onClick={() => handleEnter(subjectId)}
                      className="enter-button"
                    >
                      Ingresar
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      <footer className="footer">
        <div className="footer-content">
          <p>&copy; 2025 Plataforma Educativa. Todos los derechos reservados.</p>
          <div className="footer-links">
            <a href="/about">Acerca de</a>
            <a href="/contact">Contacto</a>
            <a href="/privacy">Políticas de privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Home;