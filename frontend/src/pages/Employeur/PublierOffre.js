import React, { useState } from "react";
import axios from "axios";
import {
  Box,
  Paper,
  Typography,
  TextField,
  Button,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Checkbox,
  ListItemText,
  OutlinedInput,
  Snackbar,
  Alert,
} from "@mui/material";

// Mapping spécialité → sous-spécialité principale + compétences secondaires
const specialties = {
  "Médecin": {
    main: ["Cardiologie", "Pédiatrie", "Chirurgie", "Dermatologie", "Oncologie", "Neurologie", "Gynécologie"],
    secondary: ["Urgences", "Soins intensifs", "Consultation générale"]
  },
  "Dentiste": {
    main: ["Orthodontie", "Parodontologie", "Implantologie", "Chirurgie dentaire", "Endodontie"],
    secondary: ["Prothèses dentaires", "Urgences dentaires"]
  },
  "Infirmier": {
    main: ["Soins infirmiers généraux", "Urgences", "Réanimation", "Pédiatrie", "Gériatrie"],
    secondary: []
  },
  "Ingénieur informatique": {
    main: ["Développement Web", "DevOps", "Data Science"],
    secondary: ["PHP","CSS","JS","React","Node.js","Python","SQL","Docker","Kubernetes"]
  },
  "Développeur Web": {
    main: ["Front-end", "Back-end", "Fullstack"],
    secondary: ["HTML","CSS","JavaScript","React","Node.js","Angular","Vue.js","PHP","MySQL","MongoDB","SASS","Tailwind","Bootstrap"]
  },
  "DevOps": {
    main: ["Infrastructure", "CI/CD", "Monitoring"],
    secondary: ["Docker","Kubernetes","Jenkins","Git","Linux","Terraform","Ansible"]
  },
};

const countries = ["Tunisie","France","Allemagne","USA","Canada","Maroc","Espagne"];

export default function PublierOffre() {
  const [title, setTitle] = useState("");
  const [company, setCompany] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [contractType, setContractType] = useState("CDI");
  const [salary, setSalary] = useState("");
  const [currency, setCurrency] = useState("€");
  const [specialite, setSpecialite] = useState("");
  const [mainSpeciality, setMainSpeciality] = useState("");
  const [secondarySkills, setSecondarySkills] = useState([]);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!specialite || !mainSpeciality) {
      setSnackbar({ open: true, message: "❌ Veuillez choisir une spécialité et une sous-spécialité principale", severity: "error" });
      return;
    }

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:5000/api/offres",
        {
          title,
          company: company || "",
          description,
          location,
          contract_type: contractType,
          salary: salary || "",
          currency,
          specialite,
          technologies: [mainSpeciality, ...secondarySkills]
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setSnackbar({ open: true, message: "✅ Offre publiée avec succès !", severity: "success" });

      // reset formulaire
      setTitle(""); setCompany(""); setDescription(""); setLocation(""); setContractType("CDI");
      setSalary(""); setCurrency("€"); setSpecialite(""); setMainSpeciality(""); setSecondarySkills([]);
    } catch (err) {
      console.error(err.response || err);
      setSnackbar({ open: true, message: err.response?.data?.message || "❌ Erreur serveur", severity: "error" });
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
      <Paper sx={{ p: 4, width: "100%", maxWidth: 600 }}>
        <Typography variant="h5" mb={2}>Publier une nouvelle offre</Typography>

        <form onSubmit={handleSubmit}>
          <TextField label="Titre du poste" fullWidth margin="normal" value={title} onChange={e => setTitle(e.target.value)} required />
          <TextField label="Entreprise" fullWidth margin="normal" value={company} onChange={e => setCompany(e.target.value)} />
          <TextField label="Description" fullWidth margin="normal" multiline rows={4} value={description} onChange={e => setDescription(e.target.value)} required />

          <TextField select label="Pays" fullWidth margin="normal" value={location} onChange={e => setLocation(e.target.value)} required>
            {countries.map(c => <MenuItem key={c} value={c}>{c}</MenuItem>)}
          </TextField>

          <TextField select label="Type de contrat" fullWidth margin="normal" value={contractType} onChange={e => setContractType(e.target.value)} required>
            <MenuItem value="CDI">CDI</MenuItem>
            <MenuItem value="CDD">CDD</MenuItem>
            <MenuItem value="Stage">Stage</MenuItem>
            <MenuItem value="Freelance">Freelance</MenuItem>
          </TextField>

          <TextField label="Salaire" type="number" fullWidth margin="normal" value={salary} onChange={e => setSalary(e.target.value)} inputProps={{ min: 0 }} />

          <TextField select label="Devise" fullWidth margin="normal" value={currency} onChange={e => setCurrency(e.target.value)}>
            <MenuItem value="€">Euro (€)</MenuItem>
            <MenuItem value="$">Dollar ($)</MenuItem>
            <MenuItem value="DT">Dinar (DT)</MenuItem>
          </TextField>

          <TextField select label="Spécialité" fullWidth margin="normal" value={specialite} onChange={e => { setSpecialite(e.target.value); setMainSpeciality(""); setSecondarySkills([]); }}>
            {Object.keys(specialties).map(spec => <MenuItem key={spec} value={spec}>{spec}</MenuItem>)}
          </TextField>

          {/* Sous-spécialité principale */}
          {specialite && specialties[specialite]?.main?.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Sous-spécialité principale</InputLabel>
              <Select
                value={mainSpeciality}
                onChange={e => setMainSpeciality(e.target.value)}
              >
                {specialties[specialite].main.map(sub => (
                  <MenuItem key={sub} value={sub}>{sub}</MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {/* Compétences secondaires */}
          {specialite && specialties[specialite]?.secondary?.length > 0 && (
            <FormControl fullWidth margin="normal">
              <InputLabel>Compétences complémentaires</InputLabel>
              <Select
                multiple
                value={secondarySkills}
                onChange={e => setSecondarySkills(e.target.value)}
                input={<OutlinedInput label="Compétences complémentaires" />}
                renderValue={selected => selected.join(", ")}
              >
                {specialties[specialite].secondary.map(skill => (
                  <MenuItem key={skill} value={skill}>
                    <Checkbox checked={secondarySkills.indexOf(skill) > -1} />
                    <ListItemText primary={skill} />
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          <Button type="submit" variant="contained" fullWidth sx={{ mt: 2 }}>Publier</Button>
        </form>

        <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({ ...snackbar, open: false })}>
          <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
        </Snackbar>
      </Paper>
    </Box>
  );
}
