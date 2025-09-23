import React, { useState, useEffect } from "react";
import { Box, Paper, TextField, Typography, MenuItem, Button } from "@mui/material";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function PublierOffre() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contractType, setContractType] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  // Vérification du rôle employeur à l'ouverture de la page
  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== "employeur") {
      alert("❌ Vous devez être connecté en employeur pour publier une offre");
      navigate("/login");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem("token");
    if (!token) return setMessage("❌ Token manquant, reconnectez-vous");

    try {
      const response = await axios.post(
        "http://localhost:5000/api/offres",
        { title, description, location, contract_type: contractType },
        { headers: { Authorization: `Bearer ${token}` } } // envoie le token
      );

      setMessage(`✅ Offre publiée avec succès ! (ID: ${response.data.offerId})`);
      setTitle("");
      setDescription("");
      setLocation("");
      setContractType("");
    } catch (error) {
      console.error("Erreur publication :", error.response?.data || error.message);
      setMessage(error.response?.data?.message || "❌ Erreur lors de la publication");
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: "url('https://images.unsplash.com/photo-1556761175-4b46a572b786')",
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Box display="flex" justifyContent="center" alignItems="center" sx={{ minHeight: "100vh", backdropFilter: "brightness(0.6)" }}>
        <Paper sx={{ p: 5, borderRadius: "20px", maxWidth: 600, width: "100%", bgcolor: "rgba(0,0,0,0.75)", color: "white" }} elevation={8}>
          <Typography variant="h4" textAlign="center" fontWeight="bold" mb={3} sx={{ color: "#00AEEF" }}>
            Publier une offre
          </Typography>

          <form onSubmit={handleSubmit}>
            <TextField
              label="Titre"
              fullWidth
              margin="normal"
              value={title}
              onChange={e => setTitle(e.target.value)}
              required
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              label="Description"
              fullWidth
              margin="normal"
              multiline
              rows={4}
              value={description}
              onChange={e => setDescription(e.target.value)}
              required
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              label="Lieu"
              fullWidth
              margin="normal"
              value={location}
              onChange={e => setLocation(e.target.value)}
              required
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            />

            <TextField
              select
              label="Type de contrat"
              fullWidth
              margin="normal"
              value={contractType}
              onChange={e => setContractType(e.target.value)}
              required
              InputLabelProps={{ style: { color: "white" } }}
              InputProps={{ style: { color: "white" } }}
            >
              <MenuItem value="CDI">CDI</MenuItem>
              <MenuItem value="CDD">CDD</MenuItem>
              <MenuItem value="Stage">Stage</MenuItem>
            </TextField>

            <Button
              type="submit"
              variant="contained"
              fullWidth
              sx={{ mt: 3, borderRadius: "10px", bgcolor: "#00AEEF", "&:hover": { bgcolor: "#0077B5" } }}
            >
              Publier l'offre
            </Button>
          </form>

          {message && (
            <Typography mt={3} textAlign="center" sx={{ color: message.startsWith("✅") ? "lightgreen" : "red" }}>
              {message}
            </Typography>
          )}
        </Paper>
      </Box>
    </Box>
  );
}
