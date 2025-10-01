const pool = require("../config/db");

const JobOffer = {
  // Créer une offre
  create: async ({ title, description, location, contract_type, salary, employer_id }) => {
    return pool.query(
      "INSERT INTO job_offers (title, description, location, contract_type, salary, employer_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())",
      [title, description, location || null, contract_type || null, salary || null, employer_id]
    );
  },

  // Récupérer toutes les offres
  getAll: async () => {
    return pool.query(
      `SELECT o.id, o.title, o.description, o.location, o.contract_type, o.salary, o.created_at, o.updated_at,
              u.name AS employer_name, u.email AS employer_email
       FROM job_offers o
       JOIN users u ON o.employer_id = u.id
       ORDER BY o.created_at DESC`
    );
  },

  // Récupérer les offres d’un employeur
  getByEmployer: async (employer_id) => {
    return pool.query(
      "SELECT * FROM job_offers WHERE employer_id = ? ORDER BY created_at DESC",
      [employer_id]
    );
  },

  // Mettre à jour une offre
  update: async (id, employer_id, { title, description, location, contract_type, salary }) => {
    return pool.query(
      "UPDATE job_offers SET title = ?, description = ?, location = ?, contract_type = ?, salary = ?, updated_at = NOW() WHERE id = ? AND employer_id = ?",
      [title, description, location, contract_type, salary, id, employer_id]
    );
  },

  // Supprimer une offre
  delete: async (id, employer_id) => {
    return pool.query("DELETE FROM job_offers WHERE id = ? AND employer_id = ?", [id, employer_id]);
  },
};

module.exports = JobOffer;
