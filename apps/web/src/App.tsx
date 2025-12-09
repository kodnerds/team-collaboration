import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import CreateProject from './components/Create-project';
import Login from './components/Login';
import ProjectDetails from './components/ProjectDetails';
import ProjectsList from './components/ProjectsList';
import SignupPage from './components/SignUp/SignupPage';
import { KanbanBoard } from './components/KanbanBoard';
const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/create-project" element={<CreateProject />} />
    <Route path="/projects" element={<ProjectsList />} />
    <Route path="/projects/:id" element={<ProjectDetails />} />
    <Route path="/signup" element={<SignupPage />} />
    <Route path="/tasks" element={<KanbanBoard />} />
  </Routes>
);

export default App;
