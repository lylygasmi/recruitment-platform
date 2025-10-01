const express = require("express");
const router = express.Router();

const {
  createJobOffer,
  getMyJobOffers,
  updateJobOffer,
  deleteJobOffer,
} = require("../controllers/offerController");

const { getApplicationsByOffer } = require("../controllers/applicationController");

const authenticateEmployer = require("../middleware/authenticateEmployer");

// ✅ Publier une offre
router.post("/offres", authenticateEmployer, createJobOffer);

// ✅ Voir mes offres
router.get("/offres/mes-offres", authenticateEmployer, getMyJobOffers);

// ✅ Modifier une offre
router.patch("/offres/:id", authenticateEmployer, updateJobOffer);

// ✅ Supprimer une offre
router.delete("/offres/:id", authenticateEmployer, deleteJobOffer);

// ✅ Voir candidatures reçues pour une offre
router.get("/offres/:job_offer_id/candidatures", authenticateEmployer, getApplicationsByOffer);

module.exports = router;
