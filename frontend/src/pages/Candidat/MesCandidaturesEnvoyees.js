import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
} from "@mui/material";

export default function MesCandidaturesEnvoyees() {
  const [candidatures, setCandidatures] = useState([]);
  const token = localStorage.getItem("token");

  // 🔹 Charger mes candidatures
  useEffect(() => {
    const fetchCandidatures = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/candidatures/mes-candidatures", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setCandidatures(res.data);
      } catch (err) {
        console.error("Erreur fetch candidatures:", err);
      }
    };
    if (token) fetchCandidatures();
  }, [token]);

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        📑 Mes Candidatures
      </Typography>

      {candidatures.length === 0 ? (
        <Typography>Aucune candidature envoyée.</Typography>
      ) : (
        candidatures.map((c) => (
          <Card key={c.id} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6">{c.title}</Typography>
              <Typography>📍 {c.location}</Typography>
              <Typography>📝 {c.contract_type}</Typography>
              <Typography>
                ⏳ Statut :{" "}
                <b
                  style={{
                    color:
                      c.status === "acceptée"
                        ? "green"
                        : c.status === "refusée"
                        ? "red"
                        : "orange",
                  }}
                >
                  {c.status}
                </b>
              </Typography>
              <Typography>
                📅 Envoyée le : {new Date(c.date_posted).toLocaleDateString()}
              </Typography>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
