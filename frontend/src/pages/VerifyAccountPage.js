import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { Box, Paper, Typography, Button, CircularProgress } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";

export default function VerifyAccountPage() {
  const { token } = useParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        if (token) {
          const res = await axios.get(
            `${process.env.REACT_APP_BACKEND_URL}/api/auth/verify/${token}`
          );
          setStatus("success");
          setMessage("✅ Votre compte est prêt. Vous pouvez maintenant vous connecter.");
        } else {
          setStatus("error");
          setMessage("Token invalide ou manquant.");
        }
      } catch (err) {
        setStatus("error");
        setMessage(err.response?.data?.message || "Erreur lors de la vérification.");
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: "100vh" }}>
      <Paper
        elevation={6}
        sx={{ p: 5, borderRadius: "20px", width: "100%", maxWidth: "450px", textAlign: "center" }}
      >
        {status === "loading" && (
          <>
            <CircularProgress color="primary" />
            <Typography sx={{ mt: 2 }}>Vérification en cours...</Typography>
          </>
        )}

        {status !== "loading" && (
          <>
            {status === "success" && <CheckCircleOutlineIcon sx={{ color: "green", fontSize: 60 }} />}
            <Typography variant="h6" sx={{ mt: 2 }}>
              {message}
            </Typography>
            {status === "success" && (
              <Button
                variant="contained"
                fullWidth
                sx={{ mt: 3 }}
                onClick={() => navigate("/login")}
              >
                Se connecter
              </Button>
            )}
          </>
        )}
      </Paper>
    </Box>
  );
}
