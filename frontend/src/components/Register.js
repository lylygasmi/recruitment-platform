import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidat");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await response.json();
      if (response.ok) {
        alert("✅ Compte créé avec succès !");
        navigate("/login");
      } else {
        alert(data.message || "❌ Erreur inscription");
      }
    } catch (error) {
      alert("❌ Erreur réseau");
    }
  };

  return (
    <Box sx={{ display: "flex", justifyContent: "center", mt: 5 }}>
      <Paper sx={{ p: 5, width: "100%", maxWidth: 400 }}>
        <Typography variant="h4" mb={3} textAlign="center">
          Inscription
        </Typography>
        <form onSubmit={handleRegister}>
          <TextField
            label="Email"
            type="email"
            fullWidth
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <TextField
            label="Mot de passe"
            type="password"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <TextField
            label="Rôle (candidat/employeur)"
            type="text"
            fullWidth
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value.toLowerCase())}
            required
          />
          <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }}>
            S'inscrire
          </Button>
        </form>
      </Paper>
    </Box>
  );
}
