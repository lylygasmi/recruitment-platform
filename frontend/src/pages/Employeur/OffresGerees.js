import React, { useEffect, useState } from "react";
import axios from "axios";
import { Box, Typography, Card, CardContent, Grid } from "@mui/material";

export default function OffresGerees() {
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffers = async () => {
      const token = localStorage.getItem("token");
      try {
        const res = await axios.get("http://localhost:5000/api/offres/mes-offres", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setOffers(Array.isArray(res.data) ? res.data : []);
      } catch (err) {
        console.error(err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchOffers();
  }, []);

  if (loading) return <Typography color="white">Chargement des offres...</Typography>;
  if (!offers.length) return <Typography color="white">Vous n’avez publié aucune offre.</Typography>;

  return (
    <Box sx={{ p: 4, maxWidth: 1000, mx: "auto" }}>
      <Typography variant="h4" color="white" mb={3}>Mes offres publiées</Typography>
      <Grid container spacing={3}>
        {offers.map((offer) => (
          <Grid item xs={12} sm={6} md={4} key={offer.id}>
            <Card sx={{ background: "#1e3a5f", color: "white" }}>
              <CardContent>
                <Typography variant="h6">{offer.title}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>{offer.description}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Lieu: {offer.location}</Typography>
                <Typography variant="body2" sx={{ mt: 1 }}>Contrat: {offer.contract_type}</Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}


