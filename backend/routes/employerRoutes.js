// backend/routes/employerRoutes.js
const express = require("express");
const router = express.Router();
const authenticateToken = require("../middleware/authenticateEmployer");
const candidatureController = require("../controllers/candidatureController");

// 🔹 Voir toutes les candidatures reçues pour mes offres
router.get("/candidatures-reçues", authenticateToken, candidatureController.getCandidaturesByEmployer);

module.exports = router;
