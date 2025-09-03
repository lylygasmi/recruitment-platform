const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const { auth } = require("../middleware/auth"); // ici on utilise auth pour toutes les routes

// Postuler à une offre
router.post("/", auth, applicationController.applyToOffer);

// Récupérer toutes les candidatures de l'utilisateur connecté
router.get("/", auth, applicationController.getApplications);

module.exports = router;



