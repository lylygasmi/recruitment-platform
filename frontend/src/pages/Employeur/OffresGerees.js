import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardActions,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Snackbar,
  Alert,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  OutlinedInput,
  Checkbox,
  ListItemText
} from "@mui/material";

// Mapping spécialité → compétences/technologies
const specialties = {
  "Ingénieur informatique": ["PHP", "CSS", "JS", "React", "Node.js", "Python", "SQL"],
  "Médecin": ["Radiologie", "Cardiologie", "Chirurgie", "Pédiatrie", "Dermatologie"],
  "Dentiste": ["Orthodontie", "Parodontologie", "Implantologie", "Chirurgie dentaire"],
  "Infirmier": ["Soins infirmiers", "Urgences", "Pédiatrie", "Gériatrie"],
  "Architecte": ["AutoCAD", "SketchUp", "3D Max", "Revit", "Planification urbaine"],
};

const countries = ["Tunisie", "France", "Allemagne", "USA", "Canada", "Maroc", "Espagne"];

export default function OffresGerees() {
  const [offres, setOffres] = useState([]);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const token = localStorage.getItem("token");

  const fetchOffres = useCallback(async () => {
    try {
      // 🔹 Corrigé : route backend correcte
      const res = await axios.get("http://localhost:5000/api/offres/mes-offres", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOffres(res.data);
    } catch (err) {
      console.error("Erreur fetchOffres:", err);
      setSnackbar({ open: true, message: "❌ Erreur serveur", severity: "error" });
    }
  }, [token]);

  useEffect(() => { fetchOffres(); }, [fetchOffres]);

  const handleDelete = async (id) => {
    if (!window.confirm("Voulez-vous vraiment supprimer cette offre ?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/offres/${id}`, { headers: { Authorization: `Bearer ${token}` } });
      setOffres(offres.filter(o => o.id !== id));
      setSnackbar({ open: true, message: "✅ Offre supprimée", severity: "success" });
    } catch (err) {
      console.error("Erreur deleteOffer:", err);
      setSnackbar({ open: true, message: "❌ Erreur serveur", severity: "error" });
    }
  };

  const handleEdit = (offer) => {
    setSelectedOffer({
      ...offer,
      technologies: offer.technologies || []
    });
    setOpenEdit(true);
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(`http://localhost:5000/api/offres/${selectedOffer.id}`, selectedOffer, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setOpenEdit(false);
      setSnackbar({ open: true, message: "✅ Offre mise à jour", severity: "success" });
      fetchOffres();
    } catch (err) {
      console.error("Erreur updateOffer:", err);
      setSnackbar({ open: true, message: "❌ Erreur serveur", severity: "error" });
    }
  };

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h4" mb={3} fontWeight="bold">Mes Offres Publiées</Typography>
      {offres.length === 0 ? (
        <Typography>Aucune offre publiée.</Typography>
      ) : (
        offres.map(o => (
          <Card key={o.id} sx={{ mb: 2, borderRadius: 2, boxShadow: 3 }}>
            <CardContent>
              <Typography variant="h6">{o.title}</Typography>
              <Typography variant="body2" color="text.secondary">
                📍 {o.location} | {o.contract_type} | 💰 {o.salary} {o.currency} | 🏷 {o.specialite}
              </Typography>
              <Typography variant="body1" mt={1}>{o.description}</Typography>
            </CardContent>
            <CardActions>
              <Button size="small" variant="contained" color="primary" onClick={() => handleEdit(o)}>Modifier</Button>
              <Button size="small" variant="contained" color="error" onClick={() => handleDelete(o.id)}>Supprimer</Button>
            </CardActions>
          </Card>
        ))
      )}

      {selectedOffer && (
        <Dialog open={openEdit} onClose={() => setOpenEdit(false)} fullWidth maxWidth="sm">
          <DialogTitle>Modifier l'offre</DialogTitle>
          <DialogContent>
            <TextField fullWidth margin="dense" label="Titre" value={selectedOffer.title} onChange={e => setSelectedOffer({ ...selectedOffer, title: e.target.value })} />
            <TextField fullWidth margin="dense" label="Description" multiline rows={3} value={selectedOffer.description} onChange={e => setSelectedOffer({ ...selectedOffer, description: e.target.value })} />
            <TextField select fullWidth margin="dense" label="Pays" value={selectedOffer.location} onChange={e => setSelectedOffer({ ...selectedOffer, location: e.target.value })}>
              {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
            </TextField>
            <TextField select fullWidth margin="dense" label="Spécialité" value={selectedOffer.specialite} onChange={e => setSelectedOffer({ ...selectedOffer, specialite: e.target.value, technologies: [] })}>
              {Object.keys(specialties).map(spec => <MenuItem key={spec} value={spec}>{spec}</MenuItem>)}
            </TextField>

            {selectedOffer.specialite && specialties[selectedOffer.specialite]?.length > 0 && (
              <FormControl fullWidth margin="dense">
                <InputLabel>Technologies / Compétences</InputLabel>
                <Select
                  multiple
                  value={selectedOffer.technologies || []}
                  onChange={e => setSelectedOffer({ ...selectedOffer, technologies: e.target.value })}
                  input={<OutlinedInput label="Technologies / Compétences" />}
                  renderValue={selected => selected.join(", ")}
                >
                  {specialties[selectedOffer.specialite].map(tech => (
                    <MenuItem key={tech} value={tech}>
                      <Checkbox checked={selectedOffer.technologies?.indexOf(tech) > -1} />
                      <ListItemText primary={tech} />
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpenEdit(false)}>Annuler</Button>
            <Button onClick={handleUpdate} variant="contained" color="primary">Sauvegarder</Button>
          </DialogActions>
        </Dialog>
      )}

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}
