import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";

export default function OffresGerees() {
  const [offres, setOffres] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);

  const token = localStorage.getItem("token");

  // Charger mes offres
  useEffect(() => {
    fetchOffres();
  }, []);

  const fetchOffres = async () => {
    const res = await axios.get("http://localhost:5000/api/offres/mes-offres", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setOffres(res.data);
  };

  // Supprimer
  const handleDelete = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer cette offre ?")) {
      await axios.delete(`http://localhost:5000/api/offres/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOffres(offres.filter((o) => o.id !== id));
    }
  };

  // Modifier
  const handleEdit = (offer) => {
    setSelectedOffer(offer);
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    await axios.patch(
      `http://localhost:5000/api/offres/${selectedOffer.id}`,
      {
        title: selectedOffer.title,
        description: selectedOffer.description,
        location: selectedOffer.location,
        contract_type: selectedOffer.contract_type,
        salary: selectedOffer.salary,
      },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setOpenEdit(false);
    fetchOffres();
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3} fontWeight="bold">
        Mes Offres Publiées
      </Typography>

      {offres.length === 0 ? (
        <Typography>Aucune offre publiée.</Typography>
      ) : (
        offres.map((o) => (
          <Card key={o.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{o.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                📍 {o.location} | {o.contract_type} | 💰 {o.salary}€
              </Typography>
              <Typography variant="body1" mt={1}>
                {o.description}
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                size="small"
                variant="contained"
                color="primary"
                onClick={() => handleEdit(o)}
              >
                Modifier
              </Button>
              <Button
                size="small"
                variant="contained"
                color="error"
                onClick={() => handleDelete(o.id)}
              >
                Supprimer
              </Button>
            </CardActions>
          </Card>
        ))
      )}

      {/* Dialog de modification */}
      {selectedOffer && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth>
          <DialogTitle>Modifier l'offre</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              margin="dense"
              label="Titre"
              value={selectedOffer.title}
              onChange={(e) =>
                setSelectedOffer({ ...selectedOffer, title: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Description"
              value={selectedOffer.description}
              onChange={(e) =>
                setSelectedOffer({
                  ...selectedOffer,
                  description: e.target.value,
                })
              }
              multiline
              rows={3}
            />
            <TextField
              fullWidth
              margin="dense"
              label="Lieu"
              value={selectedOffer.location}
              onChange={(e) =>
                setSelectedOffer({ ...selectedOffer, location: e.target.value })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Type de contrat"
              value={selectedOffer.contract_type}
              onChange={(e) =>
                setSelectedOffer({
                  ...selectedOffer,
                  contract_type: e.target.value,
                })
              }
            />
            <TextField
              fullWidth
              margin="dense"
              label="Salaire"
              type="number"
              value={selectedOffer.salary}
              onChange={(e) =>
                setSelectedOffer({ ...selectedOffer, salary: e.target.value })
              }
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">
              Sauvegarder
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Box>
  );
}

