import React, { useState } from "react";
import { Box, Button, Paper, TextField, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { Carousel } from "react-responsive-carousel";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import axios from "axios";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleForgotPassword = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      const response = await axios.post("http://localhost:5000/api/auth/forgot-password", { email });
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || "Erreur lors de l’envoi de l’email.");
    }
  };

  return (
    <Box sx={{ position: "relative", minHeight: "100vh" }}>
      {/* 🔹 Images de fond (mêmes que Login & Register) */}
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

      {/* 🔹 Formulaire */}
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
            bgcolor: "rgba(255,255,255,0.95)",
            color: "#1c1e21",
          }}
        >
          <Typography
            variant="h4"
            mb={3}
            textAlign="center"
            fontWeight="bold"
            sx={{ color: "#1877F2" }}
          >
            Mot de passe oublié
          </Typography>

          {error && <Typography color="error" textAlign="center">{error}</Typography>}
          {message && (
            <Typography color="success.main" textAlign="center">
              {message}
            </Typography>
          )}

          <form onSubmit={handleForgotPassword}>
            <TextField
              label="Adresse email"
              type="email"
              fullWidth
              margin="normal"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />

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
              Envoyer le lien de réinitialisation
            </Button>

            <Typography mt={2} textAlign="center">
              <Button
                variant="text"
                onClick={() => navigate("/login")}
                sx={{ color: "#1877F2", textTransform: "none" }}
              >
                Retour à la connexion
              </Button>
            </Typography>
          </form>
        </Paper>
      </Box>
    </Box>
  );
}
