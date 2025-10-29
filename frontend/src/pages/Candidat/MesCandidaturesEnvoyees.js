import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent } from "@mui/material";

export default function MesCandidaturesEnvoyees() {
  const [candidatures, setCandidatures] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const res = await axios.get(
          "http://localhost:5000/api/candidatures/mes-candidatures",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        console.log("💡 [DEBUG] Candidatures reçues côté frontend:", res.data);
        setCandidatures(res.data);
      } catch (err) {
        console.error("💥 Erreur fetch candidatures candidat:", err);
      }
    };

    if (token) fetchCandidatures();
  }, [token]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        📩 Mes candidatures envoyées
      </Typography>

      {candidatures.length === 0 ? (
        <Typography>Aucune candidature disponible.</Typography>
      ) : (
        candidatures.map((c) => (
          <Card key={c.id} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography>Offre : {c.offer_title}</Typography>
              <Typography>Status : {c.status}</Typography>
              <Typography>
                Envoyée le :{" "}
                {c.date_posted
                  ? new Date(c.date_posted).toLocaleDateString()
                  : "Non spécifiée"}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
