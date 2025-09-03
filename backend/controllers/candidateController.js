// controllers/candidateController.js
const Candidate = require('../models/candidateModel');

exports.registerCandidate = (req, res) => {
  const data = req.body;
  Candidate.create(data, (err, result) => {
    if (err) return res.status(500).send(err);
    res.status(201).send({ message: 'Candidate registered', id: result.insertId });
  });
};

exports.getAllCandidates = (req, res) => {
  Candidate.getAll((err, results) => {
    if (err) return res.status(500).send(err);
    res.status(200).send(results);
  });
};

// (optionnel, à compléter plus tard)
exports.loginCandidate = (req, res) => {
  res.send({ message: "Candidate login (to implement)" });
};

