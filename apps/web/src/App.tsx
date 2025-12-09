import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Project from './components/Create-project';
import Login from './components/Login';
import ProjectDetails from './components/ProjectDetails';
import ProjectsList from './components/ProjectsList';
import SignupPage from './components/SignUp/SignupPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/Create-project" element={<Project />} />
    <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
    <Route path="/projects" element={<ProjectsList />} />
    <Route path="/projects/:id" element={<ProjectDetails />} />
    <Route path="/signup" element={<SignupPage />} />
  </Routes>
);

export default App;
