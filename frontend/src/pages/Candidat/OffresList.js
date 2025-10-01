import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Button,
  Card,
  CardContent,
  Select,
  MenuItem,
} from "@mui/material";

export default function OffresList() {
  const [offers, setOffers] = useState([]);
  const [cvs, setCvs] = useState([]);
  const [selectedCV, setSelectedCV] = useState(null);

  const token = localStorage.getItem("token");

  // 🔹 Charger toutes les offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offres");
        setOffers(res.data);
      } catch (err) {
        console.error("Erreur fetch offres:", err);
      }
    };

    fetchOffers();
  }, []);

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

  // 🔹 Postuler
  const handleApply = async (offerId) => {
    if (!selectedCV) {
      alert("⚠️ Sélectionnez un CV avant de postuler");
      return;
    }

    try {
      await axios.post(
        "http://localhost:5000/api/candidatures",
        { offer_id: offerId, cv_id: selectedCV },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("✅ Candidature envoyée !");
    } catch (err) {
      console.error("Erreur postuler:", err);
      alert(err.response?.data?.message || "Erreur lors de la candidature");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        📌 Liste des Offres
      </Typography>

      {offers.length === 0 ? (
        <Typography>Aucune offre disponible.</Typography>
      ) : (
        offers.map((offer) => (
          <Card key={offer.id} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6">{offer.title}</Typography>
              <Typography>📍 {offer.location}</Typography>
              <Typography>📝 {offer.contract_type}</Typography>
              <Typography>💰 {offer.salary} €</Typography>
              <Typography mt={1}>{offer.description}</Typography>

              {/* Sélection CV */}
              <Box mt={2}>
                <Select
                  value={selectedCV || ""}
                  onChange={(e) => setSelectedCV(e.target.value)}
                  displayEmpty
                  fullWidth
                >
                  <MenuItem value="" disabled>
                    Sélectionner un CV
                  </MenuItem>
                  {cvs.map((cv) => (
                    <MenuItem key={cv.id} value={cv.id}>
                      {cv.title}
                    </MenuItem>
                  ))}
                </Select>
              </Box>

              {/* Bouton postuler */}
              <Button
                variant="contained"
                color="primary"
                sx={{ mt: 2 }}
                onClick={() => handleApply(offer.id)}
              >
                Postuler
              </Button>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
