// backend/routes/candidatureRoutes.js
const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const applicationController = require("../controllers/applicationController");
const authenticateCandidate = require("../middleware/authenticateCandidat");
const authenticateEmployeur = require("../middleware/authenticateEmployer");

// --- Configuration Multer pour upload CV ---
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/cv"),
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// --- Routes Candidat ---
router.post(
  "/postuler-cv",
  authenticateCandidate,
  upload.single("cv"),
  applicationController.createApplication
);

router.get(
  "/mes-candidatures",
  authenticateCandidate,
  applicationController.getMyApplications
);

router.delete(
  "/candidature/:id",
  authenticateCandidate,
  applicationController.deleteApplication
);

// --- Routes Employeur ---
router.get(
  "/candidatures/offre/:job_offer_id",
  authenticateEmployeur,
  applicationController.getApplicationsByOffer
);

router.get(
  "/candidatures/employeur",
  authenticateEmployeur,
  applicationController.getApplicationsByEmployer
);

router.put(
  "/:id/status",
  authenticateEmployeur,
  applicationController.updateApplicationStatus
);

module.exports = router;
