// backend/routes/offerRoutes.js
const express = require("express");
const router = express.Router();
const offerController = require("../controllers/offerController");
const authenticateEmployer = require("../middleware/authenticateEmployer");

// 🔹 Côté candidat (aucune authentification requise)
router.get("/", offerController.getAllOffers);            // Voir toutes les offres
router.get("/:id", offerController.getOfferById);        // Voir une offre par ID

// 🔹 Côté employeur (authentification requise)
router.get("/mes-offres", authenticateEmployer, offerController.getEmployerOffers); // Mes offres
router.post("/create", authenticateEmployer, offerController.createOffer);           // Créer une offre
router.put("/:id", authenticateEmployer, offerController.updateOffer);               // Mettre à jour une offre
router.delete("/:id", authenticateEmployer, offerController.deleteOffer);            // Supprimer une offre

module.exports = router;
