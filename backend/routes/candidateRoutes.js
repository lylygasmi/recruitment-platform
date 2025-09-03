// routes/candidateRoutes.js
const express = require("express");
const router = express.Router();
const { registerCandidate, getAllCandidates, loginCandidate } = require("../controllers/candidateController");

// Public
router.post("/register", registerCandidate);
router.post("/login", loginCandidate);

// Protected (par ex. pour admin seulement)
router.get("/", getAllCandidates);

module.exports = router;



