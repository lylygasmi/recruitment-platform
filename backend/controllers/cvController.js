const CV = require('../models/cvModel');
const path = require('path');
const fs = require('fs');

// ✅ Upload d’un CV par le candidat
exports.uploadCV = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'candidat') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les candidats' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'Aucun fichier téléchargé' });
    }

    const cv = await CV.create({
      candidate_id: req.user.id,
      title: req.body.title || req.file.originalname,
      description: req.body.description || '',
      file_path: `/uploads/cvs/${req.file.filename}`,
      filename: req.file.originalname
    });

    res.status(201).json({ message: 'CV téléchargé avec succès', cv });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors du téléchargement du CV', error: error.message });
  }
};

// ✅ Récupérer tous les CV d’un candidat
exports.getCVsByCandidate = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'candidat') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les candidats' });
    }

    const cvs = await CV.findAll({ where: { candidate_id: req.user.id } });
    res.json(cvs);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des CV', error: error.message });
  }
};
