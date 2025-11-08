import React, { useState } from "react";
import {
  Box,
  Button,
  Paper,
  TextField,
  Typography,
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
    confirmPassword: "",
    role: "candidat",
  });

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  // Vérification de l'URL backend
  console.log("Backend URL utilisée :", process.env.REACT_APP_BACKEND_URL);

  const validatePassword = (password) => {
    const minLength = /.{8,}/;
    const upper = /[A-Z]/;
    const lower = /[a-z]/;
    const number = /[0-9]/;
    return (
      minLength.test(password) &&
      upper.test(password) &&
      lower.test(password) &&
      number.test(password)
    );
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (formData.password !== formData.confirmPassword) {
      setError("❌ Les mots de passe ne correspondent pas.");
      return;
    }

    if (!validatePassword(formData.password)) {
      setError(
        "Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule et un chiffre."
      );
      return;
    }

    try {
      const response = await axios.post(
        `${process.env.REACT_APP_BACKEND_URL}/api/auth/register`,
        formData,
        { headers: { "Content-Type": "application/json" } }
      );

      setSuccess(response.data.message);
      setTimeout(() => navigate("/login"), 3000);
    } catch (err) {
      console.error("Erreur inscription :", err.response?.data);
      setError(err.response?.data?.message || "Erreur lors de l’inscription");
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
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
            <Typography color="error" textAlign="center" sx={{ mb: 1 }}>
              {error}
            </Typography>
          )}
          {success && (
            <Typography color="green" textAlign="center" sx={{ mb: 1 }}>
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
              label="Confirmer le mot de passe"
              type="password"
              fullWidth
              margin="normal"
              value={formData.confirmPassword}
              onChange={(e) =>
                setFormData({ ...formData, confirmPassword: e.target.value })
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
              <MenuItem value="admin">Admin</MenuItem>
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
