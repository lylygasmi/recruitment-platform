// src/components/PrivateRoute.jsx
import React from "react";
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children, role }) {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("role");

  if (!token) return <Navigate to="/login" />; // pas connecté
  if (role && userRole !== role) return <Navigate to="/login" />; // rôle incorrect

  return children; // tout va bien, affiche le contenu
}

