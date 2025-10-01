const express = require("express");
const router = express.Router();
const {
  createJobOffer,
  getAllJobOffers,
  getMyJobOffers,
  updateJobOffer,
  deleteJobOffer,
} = require("../controllers/offerController");

const authenticateEmployer = require("../middleware/authenticateEmployer");

// ✅ Voir toutes les offres (public : candidats + employeurs)
router.get("/", getAllJobOffers);

// ✅ Publier une offre (employeur uniquement)
router.post("/", authenticateEmployer, createJobOffer);

// ✅ Voir mes offres (employeur connecté)
router.get("/mes-offres", authenticateEmployer, getMyJobOffers);

// ✅ Modifier une offre (employeur)
router.patch("/:id", authenticateEmployer, updateJobOffer);

// ✅ Supprimer une offre (employeur)
router.delete("/:id", authenticateEmployer, deleteJobOffer);

module.exports = router;
