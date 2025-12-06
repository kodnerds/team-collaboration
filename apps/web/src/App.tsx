import { Routes, Route, Navigate } from 'react-router-dom';
import './App.css';

import Login from './components/Login';
import SignupPage from './components/SignUp/SignupPage';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
    <Route path="/signup" element={<SignupPage />} />
  </Routes>
);

export default App;
