import { Routes, Route, Navigate } from 'react-router-dom';

import './App.css';

import CreateProject from './components/Create-project';
import EditProject from './components/EditProject';
import { KanbanBoard } from './components/KanbanBoard';
import Login from './components/Login';
import ProjectsList from './components/ProjectsList';
import SignupPage from './components/SignUp/SignupPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/create-project" element={<CreateProject />} />
    <Route path="/projects" element={<ProjectsList />} />
    <Route path="/projects/:id" element={<KanbanBoard />} />

    <Route path="edit-project/:id" element={<EditProject />} />
    <Route path="/signup" element={<SignupPage />} />
  </Routes>
);

export default App;
