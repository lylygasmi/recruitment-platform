// src/components/PrivateRoute.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

export default function PrivateRoute({ role, children }) {
  const token = localStorage.getItem('token');
  const userRole = localStorage.getItem('role');

  if (!token) {
    // Non connecté → redirection vers login
    return <Navigate to="/" replace />;
  }

  if (role && userRole !== role) {
    // Mauvais rôle → redirection vers login
    return <Navigate to="/" replace />;
  }

  return children;
}

