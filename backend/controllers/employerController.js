// controllers/employerController.js
const Employer = require('../models/employerModel');

// Create/Register employer
exports.createEmployer = (req, res) => {
  const data = req.body;
  Employer.create(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Employer registered', id: result.insertId });
  });
};

// Get all employers
exports.getAllEmployers = (req, res) => {
  Employer.getAll((err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
};

// Login employer (to implement)
exports.loginEmployer = (req, res) => {
  res.send({ message: "Employer login (to implement)" });
};


