import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';
import ProjectsList from "./components/ProjectsList";
import ProjectDetails from "./components/ProjectDetails";

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
    <Route path="/projects" element={<ProjectsList />} />
    <Route path="/projects/:id" element={<ProjectDetails />} />
  </Routes>
);

export default App;
