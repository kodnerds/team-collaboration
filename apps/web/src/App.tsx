import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Project from './components/Create-project';
import Login from './components/Login';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/Create-project" element={<Project />} />
    <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
  </Routes>
);

export default App;
