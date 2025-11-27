import { Routes, Route, Navigate } from 'react-router-dom';

import Login from './components/Login';

const App = () => (
  <Routes>
    <Route path="/" element={<Navigate to="/login" />} />
    <Route path="/login" element={<Login />} />
    <Route path="/dashboard" element={<div>Dashboard Placeholder</div>} />
  </Routes>
);


export default App;
