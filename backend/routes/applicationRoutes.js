const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");

// ✅ Postuler à une offre
router.post("/", applicationController.createApplication);

// ✅ Récupérer les candidatures d’un candidat
router.get("/candidate/:candidate_id", applicationController.getApplicationsByCandidate);

// ✅ Récupérer les candidatures d’une offre (employeur)
router.get("/offer/:job_offer_id", applicationController.getApplicationsByOffer);

// ✅ Mettre à jour le statut d’une candidature
router.put("/:id/status", applicationController.updateApplicationStatus);

// ✅ Supprimer une candidature
router.delete("/:id", applicationController.deleteApplication);

module.exports = router;
