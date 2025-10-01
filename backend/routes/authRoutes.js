const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// Inscription
router.post("/register", authController.register);

// Connexion
router.post("/login", authController.login);

// Confirmation email
router.get("/confirm/:token", authController.confirmEmail);

module.exports = router;
