import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Typography, Button, CircularProgress } from "@mui/material";

export default function ConfirmEmail() {
  const { token } = useParams();
  const [message, setMessage] = useState("Vérification en cours...");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(`http://localhost:5000/api/auth/confirm/${token}`);
        setMessage(response.data.message || "✅ Email vérifié avec succès !");
      } catch (err) {
        setMessage(err.response?.data?.message || "❌ Erreur de vérification");
      } finally {
        setLoading(false);
      }
    };
    verifyEmail();
  }, [token]);

  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="center"
      minHeight="100vh"
      flexDirection="column"
      textAlign="center"
      p={3}
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Typography variant="h5" mb={3}>{message}</Typography>
          <Button
            variant="contained"
            onClick={() => navigate("/login")}
            sx={{
              borderRadius: "10px",
              bgcolor: "#00AEEF",
              "&:hover": { bgcolor: "#0077B5" }
            }}
          >
            Retour à la connexion
          </Button>
        </>
      )}
    </Box>
  );
}
