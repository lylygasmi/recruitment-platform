const express = require("express");
const router = express.Router();
const { uploadCV, getMyCVs, deleteCV } = require("../controllers/cvController");
const authenticateCandidate = require("../middleware/authenticateCandidat");

// ✅ Upload CV
router.post("/upload", authenticateCandidate, uploadCV);

// ✅ Voir mes CVs
router.get("/mes-cvs", authenticateCandidate, getMyCVs);

// ✅ Supprimer un CV
router.delete("/:id", authenticateCandidate, deleteCV);

module.exports = router;
