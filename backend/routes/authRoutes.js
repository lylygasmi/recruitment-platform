const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Vérification rapide que toutes les fonctions existent
console.log('AuthController functions:', Object.keys(authController));

// 🔹 Routes d’authentification
router.post('/register', authController.register);
router.post('/login', authController.login);
router.get('/verify/:token', authController.verifyAccount);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password/:token', authController.resetPassword);
router.post('/send-otp', authController.sendOTP);
router.post('/verify-otp', authController.verifyOTP);

module.exports = router;
