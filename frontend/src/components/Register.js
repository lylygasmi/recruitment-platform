import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography, MenuItem } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("Candidat");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();
      if (response.ok) {
        alert("✅ Inscription réussie");
        navigate("/login"); // redirection vers login après inscription
      } else {
        alert(data.message || "❌ Erreur lors de l’inscription");
      }
    } catch (error) {
      alert("❌ Erreur réseau");
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Carrousel */}
<Carousel autoPlay infiniteLoop showThumbs={false} showStatus={false} interval={4000} transitionTime={1200} swipeable emulateTouch stopOnHover={false} dynamicHeight={false}>
  <div>
    <img src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d" alt="Job meeting" style={{ height: "100vh", objectFit: "cover" }} />
  </div>
  <div>
    <img src="https://images.unsplash.com/photo-1522071820081-009f0129c71c" alt="Business team" style={{ height: "100vh", objectFit: "cover" }} />
  </div>
  <div>
    <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786" alt="Career" style={{ height: "100vh", objectFit: "cover" }} />
  </div>
</Carousel>


      {/* Formulaire */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Paper
          elevation={6}
          sx={{
            p: 5,
            borderRadius: "20px",
            width: "100%",
            maxWidth: "500px",
            bgcolor: "rgba(0,0,0,0.6)",
            color: "white",
          }}
        >
          <Typography variant="h4" mb={3} textAlign="center" fontWeight="bold">
            Inscription
          </Typography>

          <form onSubmit={handleRegister}>
            <TextField
              label="Nom"
              type="text"
              fullWidth
              margin="normal"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />
            <TextField
              select
              label="Rôle"
              value={role}
              onChange={(e) => setRole(e.target.value)}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            >
              <MenuItem value="Candidat">Candidat</MenuItem>
              <MenuItem value="Employeur">Employeur</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                borderRadius: "10px",
                bgcolor: "#00AEEF",
                "&:hover": { bgcolor: "#0077B5" },
              }}
            >
              S'inscrire
            </Button>

            <Typography mt={2} textAlign="center" sx={{ color: "white" }}>
              Déjà un compte ?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ color: "#00AEEF", textTransform: "none" }}
              >
                Se connecter
              </Button>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}

