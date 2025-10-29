const express = require("express");
const router = express.Router();
const applicationController = require("../controllers/applicationController");
const authenticateCandidat = require("../middleware/authenticateCandidat");
const authenticateEmployer = require("../middleware/authenticateEmployer");

// --- CANDIDAT ---
router.post("/", authenticateCandidat, applicationController.createApplication);
router.get("/candidate", authenticateCandidat, applicationController.getMyApplications);
router.delete("/:id", authenticateCandidat, applicationController.deleteApplication);

// --- EMPLOYEUR ---
router.get("/offer/:job_offer_id", authenticateEmployer, applicationController.getApplicationsByOffer);
router.get("/employer", authenticateEmployer, applicationController.getApplicationsByEmployer);
router.put("/:id/status", authenticateEmployer, applicationController.updateApplicationStatus);

module.exports = router;
