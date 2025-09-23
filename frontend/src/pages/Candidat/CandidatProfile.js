import React from "react";
import { Box, Typography, Button, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function CandidatProfile() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  return (
    <Box p={5}>
      <Typography variant="h4" mb={3}>Espace Candidat</Typography>
      <Typography mb={3}>Bienvenue dans votre profil candidat !</Typography>

      <Stack spacing={2} direction="column" mb={3}>
        <Button variant="contained" onClick={() => navigate("/candidat/offres")}>Consulter les offres</Button>
        <Button variant="contained" onClick={() => navigate("/candidat/candidatures")}>Mes candidatures</Button>
      </Stack>

      <Button variant="outlined" color="error" onClick={handleLogout}>Déconnexion</Button>
    </Box>
  );
}
