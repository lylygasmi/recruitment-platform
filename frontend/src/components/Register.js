import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

export default function Register() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("candidat");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", {
        name: fullName, // ⚠️ important → backend attend "name"
        email,
        password,
        role,
      });

      setSuccess(response.data.message);

      // ✅ Après inscription → on ne connecte pas directement
      // L’utilisateur doit vérifier son email
      setTimeout(() => {
        navigate("/login");
      }, 3000);

    } catch (err) {
      setError(err.response?.data?.message || "Erreur réseau");
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* Carousel */}
      <Carousel
        autoPlay
        infiniteLoop
        showThumbs={false}
        showStatus={false}
        interval={4000}
        transitionTime={1200}
        swipeable
        emulateTouch
        stopOnHover={false}
        dynamicHeight={false}
      >
        <div>
          <img
            src="https://images.unsplash.com/photo-1504384308090-c894fdcc538d"
            alt="Job meeting"
            style={{ height: "100vh", objectFit: "cover" }}
          />
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c"
            alt="Business team"
            style={{ height: "100vh", objectFit: "cover" }}
          />
        </div>
        <div>
          <img
            src="https://images.unsplash.com/photo-1556761175-4b46a572b786"
            alt="Career"
            style={{ height: "100vh", objectFit: "cover" }}
          />
        </div>
      </Carousel>

      {/* Formulaire */}
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%" }}
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

          {error && <Typography color="error" textAlign="center">{error}</Typography>}
          {success && <Typography color="success.main" textAlign="center">{success}</Typography>}

          <form onSubmit={handleRegister}>
            <TextField
              label="Nom complet"
              fullWidth
              margin="normal"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
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
              SelectProps={{ native: true }}
              fullWidth
              margin="normal"
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            >
              <option value="candidat">Candidat</option>
              <option value="employeur">Employeur</option>
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
