const Employer = require("../models/employerModel");
const Candidature = require("../models/offerlist");

// --- OFFRES EMPLOYEUR ---
exports.createJobOffer = async (req, res) => {
  const { title, description, location } = req.body;
  if(!req.employer || !req.employer.id) return res.status(401).json({ message:"Employeur non authentifié" });

  await Employer.createJobOffer({ employer_id: req.employer.id, title, description, location });
  res.json({ message: "Offre publiée avec succès" });
};

exports.updateJobOffer = async (req,res) => {
  const { title, description, location } = req.body;
  await Employer.updateJobOffer(req.params.id, { title, description, location });
  res.json({ message: "Offre mise à jour" });
};

exports.deleteJobOffer = async (req,res) => {
  await Employer.deleteJobOffer(req.params.id);
  res.json({ message: "Offre supprimée" });
};

exports.getMyJobOffers = async (req,res) => {
  if(!req.employer || !req.employer.id) return res.status(401).json({ message:"Employeur non authentifié" });
  const [rows] = await Employer.getMyJobOffers(req.employer.id);
  res.json(rows);
};

// --- CANDIDATURES REÇUES ---
exports.getCandidaturesByOffer = async (req,res) => {
  const [rows] = await Candidature.getByOffer(req.params.offer_id);
  res.json(rows);
};
