import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Collapse,
  Tooltip,
} from "@mui/material";

// 🔹 Vérifie le CV côté backend avec AI
const checkCVMatch = async (cvPath, offerSkills) => {
  try {
    const res = await axios.post("http://localhost:5000/api/cv/check-cv", {
      cv_path: cvPath,
      skills: offerSkills
    });
    return res.data.valid; // true si CV compatible
  } catch (err) {
    console.error("💥 Erreur checkCVMatch:", err);
    return false;
  }
};

export default function MesCandidaturesRecues() {
  const [offers, setOffers] = useState([]);
  const [candidatures, setCandidatures] = useState({});
  const [openOfferId, setOpenOfferId] = useState(null);

  const token = localStorage.getItem("token");

  // 🔹 Charger les offres publiées par l’employeur
  useEffect(() => {
    const fetchOffers = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/offres/mes-offres", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOffers(res.data);
      } catch (err) {
        console.error("💥 Erreur fetch offres:", err);
      }
    };
    if (token) fetchOffers();
  }, [token]);

  // 🔹 Charger les candidatures pour une offre
  const fetchCandidatures = async (offerId, offerSkills = []) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/candidatures/${offerId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      // 🔹 Vérifier chaque CV avec AI
      const candidats = await Promise.all(res.data.map(async (c) => {
        const match = await checkCVMatch(c.cv_filename, offerSkills);
        return { ...c, match };
      }));

      setCandidatures(prev => ({ ...prev, [offerId]: candidats }));
      setOpenOfferId(openOfferId === offerId ? null : offerId);
    } catch (err) {
      console.error("💥 Erreur fetch candidatures:", err);
    }
  };

  // 🔹 Mettre à jour le statut de la candidature
  const handleUpdateStatus = async (candidatureId, status, offerId) => {
    try {
      await axios.patch(`http://localhost:5000/api/candidatures/${candidatureId}`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchCandidatures(offerId); // recharger pour voir le nouveau statut
    } catch (err) {
      console.error("💥 Erreur update statut:", err);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "acceptée": return "green";
      case "refusée": return "red";
      default: return "orange";
    }
  };

  return (
    <Box p={3}>
      <Typography variant="h4" mb={3}>📩 Candidatures reçues</Typography>

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
                onClick={() => fetchCandidatures(offer.id, offer.technologies)}
              >
                Voir candidatures
              </Button>

              <Collapse in={openOfferId === offer.id} timeout="auto" unmountOnExit>
                <Box mt={2}>
                  {candidatures[offer.id]?.length > 0 ? (
                    candidatures[offer.id].map((c) => {
                      const isFinal = c.status === "acceptée" || c.status === "refusée";
                      return (
                        <Card key={c.id} sx={{ mb: 1, p: 1, backgroundColor: "#f9f9f9" }}>
                          <Typography>👤 <b>{c.name}</b> ({c.email})</Typography>
                          <Typography>📅 Envoyée le : {new Date(c.date_posted).toLocaleDateString()}</Typography>
                          <Typography>
                            ⏳ Statut : <span style={{ color: getStatusColor(c.status), fontWeight: "bold" }}>{c.status}</span>
                          </Typography>

                          <Box mt={1} display="flex" gap={1}>
                            <Tooltip title={isFinal ? "Candidature déjà traitée" : (c.match ? "Accepter" : "CV incompatible")}>
                              <span>
                                <Button
                                  variant="contained"
                                  color="success"
                                  disabled={isFinal || !c.match}
                                  onClick={() => handleUpdateStatus(c.id, "acceptée", offer.id)}
                                >
                                  ✅ Accepter
                                </Button>
                              </span>
                            </Tooltip>

                            <Tooltip title={isFinal ? "Candidature déjà traitée" : (c.match ? "Refuser" : "CV incompatible")}>
                              <span>
                                <Button
                                  variant="contained"
                                  color="error"
                                  disabled={isFinal || !c.match}
                                  onClick={() => handleUpdateStatus(c.id, "refusée", offer.id)}
                                >
                                  ❌ Refuser
                                </Button>
                              </span>
                            </Tooltip>
                          </Box>

                          {!c.match && <Typography color="gray" mt={1}>CV non compatible avec l’offre</Typography>}
                        </Card>
                      );
                    })
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
