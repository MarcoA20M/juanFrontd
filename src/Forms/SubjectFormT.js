import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import topicService from "../services/topicService";
import courseService from "../services/courseService";
import assignmentService from "../services/assignmentService";
import learningMaterialService from "../services/learningMaterialService";
import { getAllStudents, addStudentToCourse } from "../services/studentService";
import "../Styles/SubjectForm.css";
import { createTopic } from "../services/courseService";

const SubjectFormT = () => {
    const { nombre } = useParams(); // nombre = idCourse (string)
    const [topics, setTopics] = useState([]);
    const [assignmentsByTopic, setAssignmentsByTopic] = useState({});
    const [materialsByTopic, setMaterialsByTopic] = useState({});
    const [students, setStudents] = useState([]);
    const [activeTab, setActiveTab] = useState("General");
    const [isLoading, setIsLoading] = useState(true);
    const [forumPost, setForumPost] = useState("");
    const [assignmentComments, setAssignmentComments] = useState({});
    const [assignmentFiles, setAssignmentFiles] = useState({});
    const [showAddStudentModal, setShowAddStudentModal] = useState(false);
    const [showAddTopicModal, setShowAddTopicModal] = useState(false);
    const [showAddAssignmentModal, setShowAddAssignmentModal] = useState(false);
    const [selectedTopicForAssignment, setSelectedTopicForAssignment] = useState(null);

    useEffect(() => {
        const fetchCourseData = async () => {
            try {
                setIsLoading(true);
                console.log("Fetching data for course ID:", nombre);
                
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

                const fetchedStudents = await getAllStudents();
                setStudents(fetchedStudents);
            } catch (error) {
                console.error("Error loading course data:", error);
            } finally {
                setIsLoading(false);
            }
        };

        if (nombre) {
            fetchCourseData();
        }
    }, [nombre]);

    const handleForumSubmit = (e) => {
        e.preventDefault();
        console.log("Post enviado al foro:", forumPost);
        setForumPost("");
    };

    const handleAssignmentSubmit = (topicId, assignmentId, e) => {
        e.preventDefault();
        const comment = assignmentComments[`${topicId}-${assignmentId}`] || "";
        const file = assignmentFiles[`${topicId}-${assignmentId}`];
        console.log("Tarea enviada:", { topicId, assignmentId, comment, file });
    };

    const handleMaterialUpload = (topicId, file) => {
        console.log("Subiendo material para tema:", topicId, file);
    };

    const handleAddStudent = () => setShowAddStudentModal(true);
    const closeAddStudentModal = () => setShowAddStudentModal(false);

    const handleNewStudentSubmit = async (e) => {
        e.preventDefault();
        const studentId = e.target.studentId.value;

        try {
            await addStudentToCourse(studentId, nombre);
            alert("Alumno agregado exitosamente al curso.");
            closeAddStudentModal();
        } catch (error) {
            console.error("Error al agregar estudiante:", error);
            alert("Error al agregar estudiante: " + error.message);
        }
    };

    const handleAddTopic = () => setShowAddTopicModal(true);
    const closeAddTopicModal = () => setShowAddTopicModal(false);

    const handleNewTopicSubmit = async (e) => {
        e.preventDefault();
        const title = e.target.topicTitle.value;
        const description = e.target.topicDescription.value;
        const name = e.target.topicName.value;

        try {
            console.log("Creating topic for course ID:", nombre);
            const newTopic = await createTopic(nombre, {
                title,
                description,
                name
            });

            setTopics((prev) => [...prev, newTopic]);
            alert("Tema agregado exitosamente.");
            closeAddTopicModal();
        } catch (error) {
            console.error("Error al agregar tema:", error);
            alert("Error al agregar tema: " + error.message);
        }
    };

    // Función para abrir el modal de agregar tarea
    const handleAddAssignment = (topicId) => {
        setSelectedTopicForAssignment(topicId);
        setShowAddAssignmentModal(true);
    };

    // Función para cerrar el modal de agregar tarea
    const closeAddAssignmentModal = () => {
        setShowAddAssignmentModal(false);
        setSelectedTopicForAssignment(null);
    };

    // Función para manejar el envío de una nueva tarea
    const handleNewAssignmentSubmit = async (e) => {
        e.preventDefault();
        
        try {
            const formData = {
                title: e.target.assignmentTitle.value,
                description: e.target.assignmentDescription.value,
                dueDate: e.target.assignmentDueDate.value,
                topicId: selectedTopicForAssignment
            };

            const newAssignment = await assignmentService.addAssignment(formData);
            
            // Actualizar el estado de las tareas por tema
            setAssignmentsByTopic(prev => ({
                ...prev,
                [selectedTopicForAssignment]: [
                    ...(prev[selectedTopicForAssignment] || []), 
                    newAssignment
                ]
            }));

            alert("Tarea agregada exitosamente!");
            closeAddAssignmentModal();
        } catch (error) {
            console.error("Error al agregar tarea:", error);
            alert("Error al agregar tarea: " + error.message);
        }
    };

    if (isLoading) return <div className="loading">Cargando contenido del curso...</div>;

    return (
        <div className="subject-form-wrapper">
            <nav className="navbar">
                <div className="search-container">
                    <input type="text" placeholder="Buscar materia..." className="search-input" />
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
                        <div className="add-student-top-right">
                            <button className="add-student-btn" onClick={handleAddStudent}>
                                + Agregar Alumnos
                            </button>
                            <button className="add-topic-btn" onClick={handleAddTopic}>
                                + Agregar Temas
                            </button>
                            {topics.length > 0 && (
                                <button 
                                    className="add-assignment-btn" 
                                    onClick={() => handleAddAssignment(topics[0].idTopic)}
                                >
                                    + Agregar Tarea
                                </button>
                            )}
                        </div>

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
                                                <a href={material.fileUrl} target="_blank" rel="noopener noreferrer" className="material-link">
                                                    📄 {material.name}
                                                </a>
                                            </li>
                                        ))}
                                    </ul>
                                ) : (
                                    <p className="no-materials">No hay materiales disponibles.</p>
                                )}

                                <div className="upload-container">
                                    <input type="file" id="material-upload" onChange={(e) => e.target.files[0] && handleMaterialUpload("general", e.target.files[0])} />
                                    <label htmlFor="material-upload" className="upload-btn">Subir nuevo material</label>
                                </div>
                            </div>
                        </div>

                        {showAddStudentModal && (
                            <div className="modal">
                                <form onSubmit={handleNewStudentSubmit} className="add-student-form">
                                    <h3>Seleccionar alumno existente</h3>
                                    <label htmlFor="studentId">Alumno:</label>
                                    <select name="studentId" required>
                                        <option value="">-- Selecciona un alumno --</option>
                                        {students.map((student) => (
                                            <option key={student.idStudent} value={student.idStudent}>
                                                {student.user.firstName} {student.user.lastName} {student.user.maternalLastName}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="modal-buttons">
                                        <button type="submit" className="submit-btn">Agregar</button>
                                        <button type="button" className="cancel-btn" onClick={closeAddStudentModal}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {showAddTopicModal && (
                            <div className="modal">
                                <form onSubmit={handleNewTopicSubmit} className="add-topic-form">
                                    <h3>Agregar Nuevo Tema</h3>
                                    <label htmlFor="topicTitle">Título del Tema:</label>
                                    <input type="text" id="topicTitle" name="topicTitle" required />
                                    <label htmlFor="topicDescription">Descripción:</label>
                                    <textarea id="topicDescription" name="topicDescription" rows="3" required></textarea>
                                    <label htmlFor="topicName">Nombre del Tema (identificador interno):</label>
                                    <input type="text" id="topicName" name="topicName" required />
                                    <div className="modal-buttons">
                                        <button type="submit" className="submit-btn">Agregar</button>
                                        <button type="button" className="cancel-btn" onClick={closeAddTopicModal}>Cancelar</button>
                                    </div>
                                </form>
                            </div>
                        )}

                        <div className="students-section">
                            <h3 className="section-title">👩‍🎓 Lista de Estudiantes</h3>
                            {students.length > 0 ? (
                                <ul className="student-list">
                                    {students.map((student) => (
                                        <li key={student.idStudent} className="student-item">
                                            <p>{student.user.firstName} {student.user.lastName} {student.user.maternalLastName}</p>
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>No hay estudiantes inscritos en este curso.</p>
                            )}
                        </div>
                    </>
                ) : (
                    <div className="topic-section">
                        {topics
                            .filter(topic => topic.idTopic === activeTab)
                            .map(topic => (
                                <React.Fragment key={topic.idTopic}>
                                    <div className="topic-header">
                                        <h3>{topic.title}</h3>
                                        <p>{topic.description}</p>
                                        <button 
                                            className="add-assignment-btn"
                                            onClick={() => handleAddAssignment(topic.idTopic)}
                                        >
                                            + Agregar Tarea
                                        </button>
                                    </div>

                                    <div className="assignments-container">
                                        <h4>Tareas:</h4>
                                        {assignmentsByTopic[topic.idTopic]?.length > 0 ? (
                                            <ul className="assignment-list">
                                                {assignmentsByTopic[topic.idTopic].map(assignment => (
                                                    <li key={assignment.idAssignment} className="assignment-item">
                                                        <div className="assignment-info">
                                                            <h5>{assignment.title}</h5>
                                                            <p>{assignment.description}</p>
                                                            <small>Fecha de entrega: {new Date(assignment.dueDate).toLocaleDateString()}</small>
                                                        </div>
                                                        <button className="view-submitted-button">Ver entregas</button>
                                                    </li>
                                                ))}
                                            </ul>
                                        ) : (
                                            <p className="no-assignments">No hay tareas para este tema.</p>
                                        )}
                                    </div>
                                </React.Fragment>
                            ))}
                    </div>
                )}

                {/* Modal para agregar tarea */}
                {showAddAssignmentModal && (
                    <div className="modal">
                        <form onSubmit={handleNewAssignmentSubmit} className="add-assignment-form">
                            <h3>Agregar Nueva Tarea</h3>
                            
                            <label htmlFor="assignmentTitle">Título de la Tarea:</label>
                            <input type="text" id="assignmentTitle" name="assignmentTitle" required />
                            
                            <label htmlFor="assignmentDescription">Descripción:</label>
                            <textarea id="assignmentDescription" name="assignmentDescription" rows="3"></textarea>
                            
                            <label htmlFor="assignmentDueDate">Fecha de Entrega:</label>
                            <input type="datetime-local" id="assignmentDueDate" name="assignmentDueDate" required />
                            
                            <div className="modal-buttons">
                                <button type="submit" className="submit-btn">Agregar</button>
                                <button type="button" className="cancel-btn" onClick={closeAddAssignmentModal}>Cancelar</button>
                            </div>
                        </form>
                    </div>
                )}
            </div>
        </div>
    );
};

export default SubjectFormT;