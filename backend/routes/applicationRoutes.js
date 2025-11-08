const express = require('express');
const router = express.Router();
const applicationController = require('../controllers/applicationController');
const authenticate = require('../middleware/authMiddleware');

// Postuler à une offre
router.post('/create', authenticate, applicationController.createApplication);

// Récupérer les candidatures envoyées par le candidat
router.get('/my-applications', authenticate, applicationController.getApplicationsByCandidate);

// Récupérer les candidatures reçues par l’employeur
router.get('/received', authenticate, applicationController.getApplicationsByEmployer);

// Mettre à jour le statut d’une candidature
router.put('/:id/status', authenticate, applicationController.updateApplicationStatus);

module.exports = router;
