import React, { useState } from "react";
import { Box, Typography, Button, Stack, TextField } from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function CandidatProfile() {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");        // Nouveau champ titre
  const [description, setDescription] = useState(""); // Nouveau champ description
  const [message, setMessage] = useState("");

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setMessage("");
  };

  const handleUpload = async () => {
    if (!file) return setMessage("❌ Veuillez sélectionner un fichier");

    const formData = new FormData();
    formData.append("cv", file);
    formData.append("title", title);
    formData.append("description", description);

    try {
      const token = localStorage.getItem("token");
      const res = await axios.post("http://localhost:5000/api/cvs/upload", formData, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" },
      });
      console.log(res.data);
      setMessage("✅ CV uploadé avec succès !");
      setFile(null);
      setTitle("");
      setDescription("");
    } catch (err) {
      console.error(err.response?.data || err.message);
      setMessage(err.response?.data?.message || "❌ Erreur lors de l'upload");
    }
  };

  return (
    <Box p={5}>
      <Typography variant="h4" mb={3}>Espace Candidat</Typography>
      <Typography mb={3}>Bienvenue dans votre profil candidat !</Typography>

      <Stack spacing={2} direction="column" mb={3}>
        <Button variant="contained" onClick={() => navigate("/candidat/offres")}>Consulter les offres</Button>
        <Button variant="contained" onClick={() => navigate("/candidat/candidatures")}>Mes candidatures</Button>
      </Stack>

      {/* Upload CV */}
      <Box mb={3}>
        <Typography variant="h5" mb={1}>Uploader un CV</Typography>
        <TextField
          label="Titre du CV"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          fullWidth
          sx={{ mb: 1 }}
        />
        <TextField
          label="Description (optionnelle)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          fullWidth
          multiline
          rows={2}
          sx={{ mb: 1 }}
        />
        <input type="file" onChange={handleFileChange} />
        <Button variant="contained" sx={{ ml: 1 }} onClick={handleUpload}>Uploader</Button>
        {message && <Typography mt={1} color={message.includes("❌") ? "error" : "success.main"}>{message}</Typography>}
      </Box>

      <Button variant="outlined" color="error" onClick={handleLogout}>Déconnexion</Button>
    </Box>
  );
}
