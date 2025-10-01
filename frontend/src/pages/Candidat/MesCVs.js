import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Button } from "@mui/material";
import axios from "axios";

export default function MesCVs() {
  const [cvs, setCvs] = useState([]);

  const fetchCVs = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:5000/api/cvs/mes-cvs", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCvs(res.data);
    } catch (err) {
      console.error("Erreur chargement CVs");
    }
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:5000/api/cvs/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCVs();
    } catch (err) {
      alert("❌ Erreur suppression CV");
    }
  };

  useEffect(() => {
    fetchCVs();
  }, []);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3} fontWeight="bold">Mes CVs</Typography>

      {cvs.length === 0 ? (
        <Typography>Aucun CV uploadé.</Typography>
      ) : (
        cvs.map((cv) => (
          <Paper key={cv.id} elevation={3} sx={{ p: 3, mb: 2, borderRadius: "15px" }}>
            <Typography variant="h6">{cv.title}</Typography>
            <Typography>Description : {cv.description}</Typography>
            <Typography variant="caption">Uploadé le {new Date(cv.uploaded_at).toLocaleDateString()}</Typography>
            <Box mt={2}>
              <Button variant="outlined" color="error" onClick={() => handleDelete(cv.id)}>Supprimer</Button>
            </Box>
          </Paper>
        ))
      )}
    </Box>
  );
}
