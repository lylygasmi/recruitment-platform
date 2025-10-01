import React, { useState } from "react";
import axios from "axios";
import { Box, Button, Paper, TextField, Typography, MenuItem } from "@mui/material";

export default function PublierOffre() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contractType, setContractType] = useState("CDI");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/offres",
        { title, description, location, contract_type: contractType },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage("✅ Offre publiée avec succès !");
    } catch (err) {
      setMessage(err.response?.data?.message || "❌ Erreur lors de la publication");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 500 }}>
        <Typography variant="h5" mb={2}>Publier une nouvelle offre</Typography>
        {message && <Typography color="primary">{message}</Typography>}

        <form onSubmit={handleSubmit}>
          <TextField
            label="Titre du poste"
            fullWidth
            margin="normal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <TextField
            label="Description"
            fullWidth
            margin="normal"
            multiline
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <TextField
            label="Lieu"
            fullWidth
            margin="normal"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
          />

          {/* Liste déroulante pour type de contrat */}
          <TextField
            select
            label="Type de contrat"
            fullWidth
            margin="normal"
            value={contractType}
            onChange={(e) => setContractType(e.target.value)}
            required
          >
            <MenuItem value="CDI">CDI</MenuItem>
            <MenuItem value="CDD">CDD</MenuItem>
            <MenuItem value="Stage">Stage</MenuItem>
            <MenuItem value="Alternance">Alternance</MenuItem>
            <MenuItem value="Freelance">Freelance</MenuItem>
          </TextField>

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>
            Publier
          </Button>
        </form>
      </Paper>
    </Box>
  );
}

