// controllers/cvController.js
const path = require("path");
const Candidate = require("../models/candidateModel");

// 📤 Upload CV
exports.uploadCv = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Aucun fichier uploadé" });
    }

    // Associer le CV au candidat connecté (req.user.id si JWT)
    const candidateId = req.user.id; 
    const cvPath = path.join("uploads/cvs/", req.file.filename);

    await Candidate.update(
      { cv: cvPath },
      { where: { id: candidateId } }
    );

    res.status(200).json({ message: "CV uploadé avec succès", cv: cvPath });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Erreur serveur lors de l’upload du CV" });
  }
};

// 📥 Télécharger CV
exports.getCv = async (req, res) => {
  try {
    const candidateId = req.params.id;
    const candidate = await Candidate.findByPk(candidateId);

    if (!candidate || !candidate.cv) {
      return res.status(404).json({ message: "CV non trouvé" });
    }

    res.sendFile(path.resolve(candidate.cv));
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur lors de la récupération du CV" });
  }
};
