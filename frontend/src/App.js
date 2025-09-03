// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './components/login';
import Register from './components/Register';
import CandidatProfile from './pages/CandidatProfile';
import EmployeurProfile from './pages/EmployeurProfile';
import PrivateRoute from './components/PrivateRoute';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Pages protégées */}
        <Route 
          path="/candidat" 
          element={
            <PrivateRoute role="candidat">
              <CandidatProfile />
            </PrivateRoute>
          } 
        />
        <Route 
          path="/employeur" 
          element={
            <PrivateRoute role="employeur">
              <EmployeurProfile />
            </PrivateRoute>
          } 
        />

        {/* Redirection si aucune route correspond */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
