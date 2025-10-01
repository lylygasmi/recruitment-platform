import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  TextField,
  Card,
  CardContent,
} from "@mui/material";

export default function UploadCV() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [file, setFile] = useState(null);
  const [cvs, setCvs] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Charger mes CVs
  useEffect(() => {
    const fetchCVs = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/cvs/mes-cvs", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCvs(res.data);
      } catch (err) {
        console.error("Erreur fetch CVs:", err);
      }
    };
    if (token) fetchCVs();
  }, [token]);

  // 🔹 Uploader un CV
  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) {
      alert("⚠️ Sélectionnez un fichier !");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("cv", file);

    try {
      await axios.post("http://localhost:5000/api/cvs", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      });
      alert("✅ CV uploadé avec succès !");
      window.location.reload();
    } catch (err) {
      console.error("Erreur upload CV:", err);
      alert("Erreur upload CV");
    }
  };

  // 🔹 Supprimer un CV
  const handleDelete = async (cvId) => {
    try {
      await axios.delete(`http://localhost:5000/api/cvs/${cvId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("🗑️ CV supprimé");
      setCvs(cvs.filter((cv) => cv.id !== cvId));
    } catch (err) {
      console.error("Erreur delete CV:", err);
      alert("Erreur suppression CV");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        📂 Uploader un CV
      </Typography>

      <form onSubmit={handleUpload}>
        <TextField
          label="Titre du CV"
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
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <input
          type="file"
          accept=".pdf,.doc,.docx"
          onChange={(e) => setFile(e.target.files[0])}
          style={{ marginTop: "15px" }}
          required
        />
        <Button type="submit" variant="contained" sx={{ mt: 2 }}>
          Uploader
        </Button>
      </form>

      <Typography variant="h5" mt={4}>
        📑 Mes CVs
      </Typography>
      {cvs.length === 0 ? (
        <Typography>Aucun CV disponible.</Typography>
      ) : (
        cvs.map((cv) => (
          <Card key={cv.id} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6">{cv.title}</Typography>
              <Typography>{cv.description}</Typography>
              <Typography>
                📅 Uploadé le : {new Date(cv.uploaded_at).toLocaleDateString()}
              </Typography>
              <Button
                variant="outlined"
                color="error"
                sx={{ mt: 1 }}
                onClick={() => handleDelete(cv.id)}
              >
                Supprimer
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
