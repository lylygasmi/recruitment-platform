// routes/employerRoutes.js
const express = require('express');
const router = express.Router();
const employerController = require('../controllers/employerController');

// Create/Register employer
router.post('/', employerController.createEmployer);

// Get all employers
router.get('/', employerController.getAllEmployers);

// Employer login (placeholder)
router.post('/login', employerController.loginEmployer);

module.exports = router;






