import './App.css';
import Login from './Forms/Login';
import Home from './Forms/Home';
import Register from './Forms/Register';
import SubjectForm from './Forms/SubjectForm';
import GradesForm from './Forms/GradesForm';
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Profile from './Forms/Profile';
import AddCourseForm from './Forms/AddCourseForm';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/login" element={<Login />} />
        <Route path="/home" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/materia/:nombre" element={<SubjectForm />} />
        <Route path="/grades" element={<GradesForm />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/agregar-materia" element={<AddCourseForm />} />

      </Routes>
    </Router>
  );
}

export default App;