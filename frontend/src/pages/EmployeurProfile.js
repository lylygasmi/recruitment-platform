// src/pages/EmployeurProfile.jsx
import React from 'react';
import { Button, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function EmployeurProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    navigate('/');
  };

  return (
    <Box p={5}>
      <Typography variant="h4" mb={3}>Espace Employeur</Typography>
      <Typography mb={2}>Bienvenue dans votre profil employeur !</Typography>
      <Button variant="contained" color="error" onClick={handleLogout}>
        Déconnexion
      </Button>
    </Box>
  );
}

