const db = require("../config/db");

const Employer = {
  // Récupérer les offres d’un employeur avec nombre de candidatures
  getMyJobOffers: async (employer_id) => {
    const sql = `
      SELECT o.*, 
             (SELECT COUNT(*) FROM candidatures c WHERE c.offer_id = o.id) AS nb_candidatures
      FROM job_offers o
      WHERE o.employer_id = ?
      ORDER BY o.created_at DESC
    `;
    return db.promise().execute(sql, [employer_id]);
  },

  // Créer une offre
  createJobOffer: async ({ employer_id, title, description, location, contract_type, salary, currency, specialite, technologies }) => {
    const sql = `
      INSERT INTO job_offers (employer_id, title, description, location, contract_type, salary, currency, specialite, technologies, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())
    `;
    return db.promise().execute(sql, [employer_id, title, description, location, contract_type, salary, currency, specialite, technologies?.join(",")]);
  },

  // Mettre à jour une offre
  updateJobOffer: async (id, employer_id, data) => {
    const { title, description, location, contract_type, salary, currency, specialite, technologies } = data;
    const sql = `
      UPDATE job_offers
      SET title=?, description=?, location=?, contract_type=?, salary=?, currency=?, specialite=?, technologies=?, updated_at=NOW()
      WHERE id=? AND employer_id=?
    `;
    return db.promise().execute(sql, [title, description, location, contract_type, salary, currency, specialite, technologies?.join(","), id, employer_id]);
  },

  // Supprimer une offre
  deleteJobOffer: async (id, employer_id) => {
    const sql = "DELETE FROM job_offers WHERE id=? AND employer_id=?";
    return db.promise().execute(sql, [id, employer_id]);
  }
};

module.exports = Employer;
