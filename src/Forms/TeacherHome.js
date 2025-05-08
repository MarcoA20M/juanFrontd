import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStudentCoursesP } from "../services/courseService"; // método para cursos del profesor
import "../Styles/Home.css";

const TeacherHome = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredSubjects, setFilteredSubjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTeacherCourses = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('No autenticado. Redirigiendo a login...');
        }

        const data = await getStudentCoursesP();
        console.log("Cursos del profesor:", data);

        const coursesArray = Array.isArray(data) ? data : data ? [data] : [];

        setSubjects(coursesArray);
        setFilteredSubjects(coursesArray);

        if (coursesArray.length === 0) {
          console.warn("No hay cursos asignados al profesor");
        }
      } catch (err) {
        console.error("Error al cargar cursos:", err);
        setError(err.response?.data?.message || err.message);

        if (err.response?.status === 401 || err.message.includes('No autenticado')) {
          localStorage.removeItem('token');
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTeacherCourses();
  }, [navigate]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) {
      setFilteredSubjects(subjects);
    } else {
      const filtered = subjects.filter(subject =>
        subject.name?.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredSubjects(filtered);
    }
  };

  const handleEnter = (subjectId) => {
    navigate(`/materias/${subjectId}`);
  };

  const handleRefresh = () => {
    setLoading(true);
    setError(null);
    setSearchQuery("");
    window.location.reload();
  };

  const handleCreateSubject = () => {
    navigate("/agregar-materia"); // Aquí se redirige al formulario de creación
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
        <div className="nav-brand">Panel del Profesor</div>

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
            <button type="submit" className="search-button" disabled={loading}>
              {loading ? 'Buscando...' : 'Buscar'}
            </button>
          </form>
        </div>

        <ul className="nav-menu">
          <li><a href="/homeTeacher" className="nav-link active">Inicio</a></li>
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
        <h1>Mis Materias Asignadas</h1>
        <p className="subtitle">Bienvenido a tu panel docente</p>
        <button className="create-subject-button" onClick={handleCreateSubject}>
          Crear nueva materia
        </button>
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
            <p>No se encontraron materias a tu cargo.</p>
            <button onClick={handleRefresh} className="primary-button">
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
                    <h3>{subject.name || 'Sin nombre'}</h3>
                    <span className="subject-code">{subject.code || 'N/A'}</span>
                  </div>

                  <p className="subject-description">
                    {subject.description || 'Sin descripción'}
                  </p>

                  <div className="subject-footer">
                    <div className="teacher-info">
                      <span className="label">Tú eres el profesor</span>
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
            <a href="/privacy">Privacidad</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default TeacherHome;
