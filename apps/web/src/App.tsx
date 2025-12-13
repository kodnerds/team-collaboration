import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import CreateProject from './components/Create-project';
import { KanbanBoard } from './components/KanbanBoard';
import Login from './components/Login';
import ProjectsList from './components/ProjectsList';
import SignupPage from './components/SignUp/SignupPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
    <Route path="/tasks" element={<KanbanBoard />} />
    <Route path="/create-project" element={<CreateProject />} />
    <Route path="/projects" element={<ProjectsList />} />
    <Route path="/projects/:id" element={<KanbanBoard />} />
    <Route path="/signup" element={<SignupPage />} />
  </Routes>
);

export default App;
