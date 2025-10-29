import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
  Link as MuiLink,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

export default function Register() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "candidat",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/auth/register",
        formData
      );

      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l’inscription");
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* 🔹 Carousel d’arrière-plan */}
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

      {/* 🔹 Formulaire d’inscription */}
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
            maxWidth: "450px",
            bgcolor: "rgba(255,255,255,0.9)",
          }}
        >
          <Typography
            variant="h4"
            mb={3}
            textAlign="center"
            fontWeight="bold"
            color="#1877F2"
          >
            Créer un compte
          </Typography>

          {error && (
            <Typography color="error" textAlign="center">
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="green" textAlign="center">
              {success}
            </Typography>
          )}

          <form onSubmit={handleRegister}>
            <TextField
              label="Nom complet"
              fullWidth
              margin="normal"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              required
            />
            <TextField
              label="Email"
              type="email"
              fullWidth
              margin="normal"
              value={formData.email}
              onChange={(e) =>
                setFormData({ ...formData, email: e.target.value })
              }
              required
            />
            <TextField
              label="Mot de passe"
              type="password"
              fullWidth
              margin="normal"
              value={formData.password}
              onChange={(e) =>
                setFormData({ ...formData, password: e.target.value })
              }
              required
            />

            <TextField
              select
              label="Rôle"
              fullWidth
              margin="normal"
              value={formData.role}
              onChange={(e) =>
                setFormData({ ...formData, role: e.target.value })
              }
            >
              <MenuItem value="candidat">Candidat</MenuItem>
              <MenuItem value="employeur">Employeur</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{
                mt: 3,
                borderRadius: "10px",
                bgcolor: "#1877F2",
                "&:hover": { bgcolor: "#166FE5" },
              }}
            >
              S’inscrire
            </Button>

            <Typography mt={2} textAlign="center">
              Déjà un compte ?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ color: "#1877F2", textTransform: "none" }}
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
