const express = require("express");
const router = express.Router();
const {
  createCandidature,
  getMyCandidatures,
  getCandidaturesByOffer,
  updateCandidatureStatus,
} = require("../controllers/candidatureController");

const authenticateCandidat = require("../middleware/authenticateCandidat");
const authenticateEmployer = require("../middleware/authenticateEmployer");

// ✅ Postuler à une offre (candidat uniquement)
router.post("/", authenticateCandidat, createCandidature);

// ✅ Voir mes candidatures envoyées (candidat)
router.get("/mes-candidatures", authenticateCandidat, getMyCandidatures);

// ✅ Voir candidatures reçues pour une offre (employeur)
router.get("/:offer_id", authenticateEmployer, getCandidaturesByOffer);

// ✅ Accepter / Refuser une candidature (employeur)
router.patch("/:id", authenticateEmployer, updateCandidatureStatus);

module.exports = router;
