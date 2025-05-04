import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, searchSubjects } from "../services/subjectService";
import "../Styles/Home.css";

const Home = () => {
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects();
        setSubjects(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    try {
      const data = await searchSubjects(searchQuery);
      setSubjects(data);
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEnter = (subjectId) => {
    navigate(`/materia/${subjectId}`);
  };

  if (loading) return <div className="loading">Cargando materias...</div>;
  if (error) return <div className="error">Error: {error}</div>;

  return (
    <div className="home-container">
      <nav className="navbar">
        <div className="search-container">
          <form onSubmit={handleSearch}>
            <input
              type="text"
              placeholder="Buscar materia..."
              className="search-input"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <button type="submit" className="search-button">Buscar</button>
          </form>
        </div>
        <ul>
          <li><a href="#">Inicio</a></li>
          <li><a href="#">Calificaciones</a></li>
          <li><a href="/profile">Perfil</a></li>
        </ul>
      </nav>
      <header className="header">
        <h1>Bienvenido a la Plataforma de Materias</h1>
      </header>
      <main className="main-content">
        <div className="subject-grid">
          {subjects.map((subject) => (
            <div className="subject-card" key={subject.id}>
              <h3>{subject.name}</h3>
              <p>{subject.description}</p>
              <button 
                className="btn" 
                onClick={() => handleEnter(subject.id)}
              >
                Entrar
              </button>
            </div>
          ))}
        </div>
      </main>
      <footer className="footer">
        <p>&copy; 2025 Plataforma Educativa - Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Home;