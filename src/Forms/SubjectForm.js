import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import topicService from "../services/topicService";
import assignmentService from "../services/assignmentService";
import learningMaterialService from "../services/learningMaterialService";
import "../Styles/SubjectForm.css";

const SubjectForm = () => {
    const { nombre } = useParams();
    const [topics, setTopics] = useState([]);
    const [assignmentsByTopic, setAssignmentsByTopic] = useState({});
    const [materialsByTopic, setMaterialsByTopic] = useState({});
    const [activeTab, setActiveTab] = useState("General");
    const [isLoading, setIsLoading] = useState(true);
    const [forumPost, setForumPost] = useState("");
    const [assignmentComments, setAssignmentComments] = useState({});
    const [assignmentFiles, setAssignmentFiles] = useState({});

    // Cargar datos del curso
    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setIsLoading(true);
                const fetchedTopics = await topicService.getTopicsByCourseId(nombre);
                setTopics(fetchedTopics);

                const assignmentsData = {};
                const materialsData = {};

                await Promise.all(
                    fetchedTopics.map(async (topic) => {
                        assignmentsData[topic.idTopic] = await assignmentService.getAssignmentsByTopic(topic.idTopic);
                        materialsData[topic.idTopic] = await learningMaterialService.getMaterialsByTopicId(topic.idTopic);
                    })
                );

                setAssignmentsByTopic(assignmentsData);
                setMaterialsByTopic(materialsData);
            } catch (error) {
                console.error("Error loading course data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchCourseData();
    }, [nombre]);

    const handleForumSubmit = (e) => {
        e.preventDefault();
        console.log("Post enviado al foro:", forumPost);
        setForumPost("");
        // Aquí iría la llamada al servicio del foro
    };

    const handleAssignmentSubmit = (topicId, assignmentId, e) => {
        e.preventDefault();
        const comment = assignmentComments[`${topicId}-${assignmentId}`] || "";
        const file = assignmentFiles[`${topicId}-${assignmentId}`];
        
        console.log("Tarea enviada:", {
            topicId,
            assignmentId,
            comment,
            file
        });
        
        // Aquí iría la llamada al servicio de assignments
    };

    const handleMaterialUpload = (topicId, file) => {
        console.log("Subiendo material para tema:", topicId, file);
        // Aquí iría la llamada al servicio de materiales
    };

    if (isLoading) {
        return <div className="loading">Cargando contenido del curso...</div>;
    }

    return (
        <div className="subject-form-wrapper">
            <nav className="navbar">
                <div className="search-container">
                    <input 
                        type="text" 
                        placeholder="Buscar materia..." 
                        className="search-input" 
                    />
                </div>
                <ul className="navbar-links">
                    <li><a href="/home">Inicio</a></li>
                    <li><a href="/grade">Calificaciones</a></li>
                    <li><a href="/profile">Perfil</a></li>
                </ul>
            </nav>

            <div className="subject-form-card">
                <h2 className="subject-title">
                    Materia: {topics[0]?.course?.name || "Curso"}
                </h2>

                <div className="tabs">
                    <button 
                        className={`tab ${activeTab === "General" ? "active" : ""}`}
                        onClick={() => setActiveTab("General")}
                    >
                        General
                    </button>
                    {topics.map((topic) => (
                        <button
                            key={topic.idTopic}
                            className={`tab ${activeTab === topic.idTopic ? "active" : ""}`}
                            onClick={() => setActiveTab(topic.idTopic)}
                        >
                            {topic.title}
                        </button>
                    ))}
                </div>

                {activeTab === "General" ? (
                    <>
                        <div className="section">
                            <h3 className="section-title">📎 Material de apoyo</h3>
                            <p className="section-desc">
                                Materiales compartidos por el docente para todo el curso.
                            </p>
                            
                            <div className="material-list-container">
                                {Object.values(materialsByTopic).flat().length > 0 ? (
                                    <ul className="material-list">
                                        {Object.values(materialsByTopic).flat().map(material => (
                                            <li key={material.idMaterial} className="material-item">
                                                <a 
                                                    href={material.fileUrl} 
                                                    target="_blank" 
                                                    rel="noopener noreferrer"
                                                    className="material-link"
                                                >
                                                    📄 {material.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-materials">No hay materiales disponibles.</p>
                                )}

                                <div className="upload-container">
                                    <input 
                                        type="file" 
                                        id="material-upload"
                                        onChange={(e) => e.target.files[0] && handleMaterialUpload("general", e.target.files[0])}
                                    />
                                    <label htmlFor="material-upload" className="upload-btn">
                                        Subir nuevo material
                                    </label>
                                </div>
                            </div>
                        </div>

                        <div className="section">
                            <h3 className="section-title">💬 Foro de discusión</h3>
                            <form onSubmit={handleForumSubmit} className="forum-form">
                                <textarea
                                    className="form-textarea"
                                    rows="3"
                                    placeholder="Escribe tu participación..."
                                    value={forumPost}
                                    onChange={(e) => setForumPost(e.target.value)}
                                    required
                                />
                                <button type="submit" className="form-btn">
                                    Publicar en foro
                                </button>
                            </form>
                        </div>
                    </>
                ) : (
                    <div className="topic-section">
                        {topics
                            .filter(topic => topic.idTopic === activeTab)
                            .map(topic => (
                                <React.Fragment key={topic.idTopic}>
                                    <div className="topic-header">
                                        <h3 className="section-title">📘 {topic.title}</h3>
                                        <p className="section-desc">
                                            {topic.description || "Descripción no disponible"}
                                        </p>
                                    </div>

                                    <div className="materials-section">
                                        <h4>Materiales del tema</h4>
                                        <div className="material-list-container">
                                            {materialsByTopic[topic.idTopic]?.length > 0 ? (
                                                <ul className="material-list">
                                                    {materialsByTopic[topic.idTopic].map(material => (
                                                        <li key={material.idMaterial} className="material-item">
                                                            <a 
                                                                href={material.fileUrl} 
                                                                target="_blank" 
                                                                rel="noopener noreferrer"
                                                                className="material-link"
                                                            >
                                                                📄 {material.name}
                                                            </a>
                                                        </li>
                                                    ))}
                                                </ul>
                                            ) : (
                                                <p className="no-materials">No hay materiales para este tema.</p>
                                            )}

                                        </div>
                                    </div>

                                    <div className="assignments-section">
                                        <h4>Tareas asignadas</h4>
                                        {assignmentsByTopic[topic.idTopic]?.length > 0 ? (
                                            assignmentsByTopic[topic.idTopic].map(assignment => (
                                                <div key={assignment.idAssignment} className="assignment-card">
                                                    <div className="assignment-header">
                                                        <h4>{assignment.title}</h4>
                                                        <p className="due-date">
                                                            Fecha de entrega: {new Date(assignment.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    
                                                    <p className="assignment-desc">{assignment.description}</p>
                                                    
                                                    <form 
                                                        onSubmit={(e) => handleAssignmentSubmit(topic.idTopic, assignment.idAssignment, e)}
                                                        className="assignment-form"
                                                    >
                                                       
                                                        
                                                        <div className="form-group">
                                                            <label htmlFor={`file-${assignment.idAssignment}`} className="form-label">
                                                                Archivo:
                                                            </label>
                                                            <input
                                                                type="file"
                                                                id={`file-${assignment.idAssignment}`}
                                                                className="form-file"
                                                                onChange={(e) => setAssignmentFiles({
                                                                    ...assignmentFiles,
                                                                    [`${topic.idTopic}-${assignment.idAssignment}`]: e.target.files[0]
                                                                })}
                                                                required
                                                            />
                                                        </div>
                                                        
                                                        <button type="submit" className="submit-btn">
                                                            Enviar tarea
                                                        </button>
                                                    </form>
                                                </div>
                                            ))
                                        ) : (
                                            <p className="no-assignments">No hay tareas asignadas para este tema.</p>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectForm;