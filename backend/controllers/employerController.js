const Employer = require('../models/employerModel');

// ✅ Récupérer le profil d’un employeur
exports.getEmployerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const employer = await Employer.findOne({ where: { id } });
    if (!employer) return res.status(404).json({ message: 'Employeur non trouvé' });

    res.json({ employer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la récupération du profil', error: error.message });
  }
};

// ✅ Mettre à jour le profil d’un employeur
exports.updateEmployerProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, company, speciality } = req.body;

    const employer = await Employer.findOne({ where: { id } });
    if (!employer) return res.status(404).json({ message: 'Employeur non trouvé' });

    employer.name = name || employer.name;
    employer.email = email || employer.email;
    employer.company = company || employer.company;
    employer.speciality = speciality || employer.speciality;

    await employer.save();

    res.json({ message: 'Profil mis à jour avec succès', employer });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Erreur lors de la mise à jour du profil', error: error.message });
  }
};
