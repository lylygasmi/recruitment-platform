import React, { useState, useEffect } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate, useLocation } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  // 🔹 Auto-login depuis lien de confirmation (optionnel)
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const autoLogin = params.get("autologin");
    const token = params.get("token");

    if (autoLogin && token) {
      localStorage.setItem("token", token);

      const payload = JSON.parse(atob(token.split(".")[1]));
      localStorage.setItem("role", payload.role);

      if (payload.role === "candidat") navigate("/candidat/profile");
      else if (payload.role === "employeur") navigate("/employeur/profile");
    }
  }, [location, navigate]);

  // 🔹 Redirection si déjà connecté
  useEffect(() => {
    const token = localStorage.getItem("token");
    const role = localStorage.getItem("role");
    if (token) {
      if (role === "candidat") navigate("/candidat/profile");
      else if (role === "employeur") navigate("/employeur/profile");
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", { email, password });
      const data = response.data;

      // Sauvegarder token et rôle
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      // Redirection selon le rôle
      if (data.user.role === "employeur") navigate("/employeur/profile");
      else if (data.user.role === "candidat") navigate("/candidat/profile");
    } catch (err) {
      if (err.response?.status === 403) {
        setError("⚠️ Compte non vérifié. Vérifiez vos emails pour activer votre compte.");
      } else {
        setError(err.response?.data?.message || "Erreur réseau");
      }
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
            Connexion
          </Typography>

          {error && <Typography color="error" textAlign="center">{error}</Typography>}

          <form onSubmit={handleLogin}>
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
              Se connecter
            </Button>

            <Typography mt={2} textAlign="center" sx={{ color: "white" }}>
              Pas encore de compte ?{" "}
              <Button
                variant="text"
                onClick={() => navigate("/register")}
                sx={{ color: "#00AEEF", textTransform: "none" }}
              >
                S'inscrire
              </Button>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
