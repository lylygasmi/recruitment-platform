// src/pages/Employeur/EmployeurProfile.jsx
import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function EmployeurProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Box p={5}>
      <Typography variant="h4" mb={3}>Espace Employeur</Typography>
      <Typography mb={3}>Bienvenue dans votre profil employeur !</Typography>

      <Stack spacing={2} direction="column" mb={3}>
        <Button
          variant="contained"
          onClick={() => navigate("/employeur/publier")}
        >
          Publier une offre
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/employeur/offres")}
        >
          Gérer mes offres
        </Button>
        <Button
          variant="contained"
          onClick={() => navigate("/employeur/candidatures")}
        >
          Candidatures reçues
        </Button>
      </Stack>

      <Button variant="outlined" color="error" onClick={handleLogout}>
        Déconnexion
      </Button>
    </Box>
  );
}
