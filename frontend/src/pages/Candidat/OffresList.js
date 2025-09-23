import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";

export default function OffresList() {
  const [offres, setOffres] = useState([]);

  useEffect(() => {
    const fetchOffres = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/offres", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffres(res.data);
      } catch (err) {
        console.error("Erreur récupération offres :", err.response?.data || err.message);
      }
    };
    fetchOffres();
  }, []);

  if (offres.length === 0) {
    return <Typography>Aucune offre disponible pour le moment.</Typography>;
  }

  return (
    <Box sx={{ display: "grid", gap: 2, p: 3 }}>
      {offres.map((offre) => (
        <Card key={offre.id} sx={{ backgroundColor: "#1e1e1e", color: "white" }}>
          <CardContent>
            <Typography variant="h6">{offre.title}</Typography>
            <Typography>{offre.description}</Typography>
            <Typography>Lieu : {offre.location}</Typography>
            <Typography>Type : {offre.contract_type}</Typography>
            <Typography>Employeur : {offre.employer_name}</Typography>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}
