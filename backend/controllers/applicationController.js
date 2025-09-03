const Application = require("../models/applicationModel");

exports.applyToOffer = (req, res) => {
  const candidate_id = req.user.id;
  const { offer_id } = req.body;
  const cv = req.file.filename;

  Application.create({ candidate_id, offer_id, cv }, (err) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "✅ Application submitted" });
  });
};

exports.getMyApplications = (req, res) => {
  const candidate_id = req.user.id;

  Application.getByCandidate(candidate_id, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
};
