import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Collapse,
} from "@mui/material";

export default function MesCandidaturesRecues() {
  const [offers, setOffers] = useState([]);
  const [candidatures, setCandidatures] = useState({});
  const [openOfferId, setOpenOfferId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔹 Charger mes offres
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offres/mes-offres", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setOffers(res.data);
      } catch (err) {
        console.error("Erreur fetch mes offres:", err);
      }
    };
    if (token) fetchOffers();
  }, [token]);

  // 🔹 Charger candidatures pour une offre
  const fetchCandidatures = async (offerId) => {
    try {
      const res = await axios.get(
        `http://localhost:5000/api/candidatures/${offerId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setCandidatures((prev) => ({ ...prev, [offerId]: res.data }));
      setOpenOfferId(openOfferId === offerId ? null : offerId); // toggle ouverture
    } catch (err) {
      console.error("Erreur fetch candidatures:", err);
    }
  };

  // 🔹 Changer statut
  const handleUpdateStatus = async (candidatureId, status, offerId) => {
    try {
      await axios.patch(
        `http://localhost:5000/api/candidatures/${candidatureId}`,
        { status },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`✅ Candidature ${status}`);
      fetchCandidatures(offerId); // recharger la liste
    } catch (err) {
      console.error("Erreur update statut:", err);
      alert("Erreur changement de statut");
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>
        📩 Candidatures reçues
      </Typography>

      {offers.length === 0 ? (
        <Typography>Aucune offre publiée.</Typography>
      ) : (
        offers.map((offer) => (
          <Card key={offer.id} sx={{ mb: 2, p: 2 }}>
            <CardContent>
              <Typography variant="h6">{offer.title}</Typography>
              <Typography>📍 {offer.location}</Typography>
              <Typography>📝 {offer.contract_type}</Typography>
              <Button
                variant="outlined"
                sx={{ mt: 1 }}
                onClick={() => fetchCandidatures(offer.id)}
              >
                Voir candidatures
              </Button>

              <Collapse in={openOfferId === offer.id} timeout="auto" unmountOnExit>
                <Box mt={2}>
                  {candidatures[offer.id] && candidatures[offer.id].length > 0 ? (
                    candidatures[offer.id].map((c) => (
                      <Card key={c.id} sx={{ mb: 1, p: 1 }}>
                        <Typography>
                          👤 <b>{c.name}</b> ({c.email})
                        </Typography>
                        <Typography>
                          📅 Envoyée le : {new Date(c.date_posted).toLocaleDateString()}
                        </Typography>
                        <Typography>⏳ Statut : {c.status}</Typography>

                        <Box mt={1} display="flex" gap={1}>
                          <Button
                            variant="contained"
                            color="success"
                            onClick={() => handleUpdateStatus(c.id, "acceptée", offer.id)}
                          >
                            ✅ Accepter
                          </Button>
                          <Button
                            variant="contained"
                            color="error"
                            onClick={() => handleUpdateStatus(c.id, "refusée", offer.id)}
                          >
                            ❌ Refuser
                          </Button>
                        </Box>
                      </Card>
                    ))
                  ) : (
                    <Typography>Aucune candidature reçue.</Typography>
                  )}
                </Box>
              </Collapse>
            </CardContent>
          </Card>
        ))
      )}
    </Box>
  );
}
