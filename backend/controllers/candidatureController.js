const Application = require('../models/applicationModel');
const JobOffer = require('../models/jobOfferModel');
const Candidate = require('../models/candidateModel');
const Employer = require('../models/employerModel');
const nodemailer = require('nodemailer');
require('dotenv').config();

// 📧 Configuration Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
  auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS }
});


// ✅ 1️⃣ Postuler à une offre
exports.createApplication = async (req, res) => {
  try {
    const { offer_id, cv_path, required_skills } = req.body;

    if (!req.user || req.user.role !== 'candidat') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les candidats' });
    }

    const application = await Application.create({
      candidate_id: req.user.id,
      offer_id,
      cv_path,
      required_skills
    });

    // Envoi d’un email à l’employeur
    const offer = await JobOffer.findByPk(offer_id);
    const employer = await Employer.findByPk(offer.employer_id);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: employer.email,
      subject: 'Nouvelle candidature sur HireMe',
      html: `<p>Bonjour ${employer.name},</p>
             <p>Vous avez reçu une nouvelle candidature pour votre offre <strong>${offer.title}</strong>.</p>
             <p>Connectez-vous à votre tableau de bord HireMe pour voir les détails.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: 'Candidature envoyée avec succès', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la création de la candidature', error: error.message });
  }
};



// ✅ 2️⃣ Voir les candidatures d’un candidat connecté
exports.getApplicationsByCandidate = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'candidat') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les candidats' });
    }

    const applications = await Application.findAll({
      where: { candidate_id: req.user.id },
      include: [{ model: JobOffer, as: 'offer' }]
    });

    res.status(200).json(applications);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures', error: error.message });
  }
};



// ✅ 3️⃣ Voir les candidatures reçues par un employeur
exports.getApplicationsByEmployer = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employeur') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les employeurs' });
    }

    const offers = await JobOffer.findAll({
      where: { employer_id: req.user.id },
      include: [
        {
          model: Application,
          as: 'applications',
          include: [{ model: Candidate, as: 'candidate' }]
        }
      ]
    });

    res.status(200).json(offers);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération des candidatures reçues', error: error.message });
  }
};



// ✅ 4️⃣ Mettre à jour le statut d’une candidature
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (!req.user || req.user.role !== 'employeur') {
      return res.status(403).json({ message: 'Accès refusé : uniquement pour les employeurs' });
    }

    const { id } = req.params;
    const { status } = req.body;

    const application = await Application.findByPk(id);
    if (!application) {
      return res.status(404).json({ message: 'Candidature non trouvée' });
    }

    await application.update({ status });

    // 📧 Notification par email au candidat
    const candidate = await Candidate.findByPk(application.candidate_id);
    const offer = await JobOffer.findByPk(application.offer_id);

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: candidate.email,
      subject: `Mise à jour de votre candidature - ${offer.title}`,
      html: `<p>Bonjour ${candidate.name},</p>
             <p>Le statut de votre candidature pour l'offre <strong>${offer.title}</strong> a été mis à jour en : <strong>${status}</strong>.</p>
             <p>Merci d’utiliser HireMe.</p>`
    };

    await transporter.sendMail(mailOptions);

    res.status(200).json({ message: 'Statut mis à jour avec succès', application });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du statut', error: error.message });
  }
};
