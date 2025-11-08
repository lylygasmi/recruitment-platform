const express = require('express');
const router = express.Router();
const candidatureController = require('../controllers/candidatureController');
const authenticateCandidat = require('../middleware/authenticateCandidat');
const authenticateEmployer = require('../middleware/authenticateEmployer');

// ✅ Postuler à une offre  
router.post('/create', authenticateCandidat, candidatureController.createApplication);

// ✅ Voir mes candidatures (candidat)
router.get('/my', authenticateCandidat, candidatureController.getApplicationsByCandidate);

// ✅ Voir candidatures reçues (employeur)
router.get('/received', authenticateEmployer, candidatureController.getApplicationsByEmployer);

// ✅ Mettre à jour le statut (employeur)
router.put('/update/:id', authenticateEmployer, candidatureController.updateApplicationStatus);

module.exports = router;
