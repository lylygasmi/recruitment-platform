const express = require('express');
const router = express.Router();
const offerController = require('../controllers/offerController');
const authenticateEmployer = require('../middleware/authenticateEmployer');

// ✅ Publier une offre
router.post('/create', authenticateEmployer, offerController.createOffer);

// ✅ Voir toutes mes offres (employeur)
router.get('/my', authenticateEmployer, offerController.getMyOffers);

// ✅ Voir toutes les offres (candidat)
router.get('/all', offerController.getAllOffers);

// ✅ Mettre à jour une offre
router.put('/update/:id', authenticateEmployer, offerController.updateOffer);

// ✅ Supprimer une offre
router.delete('/delete/:id', authenticateEmployer, offerController.deleteOffer);

module.exports = router;
