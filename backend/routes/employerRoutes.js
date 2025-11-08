const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');

// ✅ Profil employeur
router.get('/:id', employerController.getEmployerProfile);

// ✅ Mettre à jour profil
router.put('/:id', employerController.updateEmployerProfile);

module.exports = router;
