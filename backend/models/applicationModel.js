const pool = require("../config/db");

const Application = {
  // Créer une candidature
  create: async ({ candidate_id, offer_id }) => {
    return pool.query(
      "INSERT INTO candidatures (candidate_id, offer_id, date_posted, status) VALUES (?, ?, NOW(), 'en_attente')",
      [candidate_id, offer_id]
    );
  },

  // Récupérer les candidatures d'un candidat
  getByCandidate: async (candidate_id) => {
    return pool.query(
      `SELECT c.id, c.status, c.date_posted,
              o.title AS offer_title, o.description AS offer_description, o.location
       FROM candidatures c
       JOIN job_offers o ON c.offer_id = o.id
       WHERE c.candidate_id = ?
       ORDER BY c.date_posted DESC`,
      [candidate_id]
    );
  },

  // Récupérer les candidatures pour une offre
  getByOffer: async (offer_id) => {
    return pool.query(
      `SELECT c.id, c.status, c.date_posted,
              u.name AS candidate_name, u.email AS candidate_email
       FROM candidatures c
       JOIN users u ON c.candidate_id = u.id
       WHERE c.offer_id = ?
       ORDER BY c.date_posted DESC`,
      [offer_id]
    );
  },

  // Mettre à jour le statut d'une candidature
  updateStatus: async (id, status) => {
    return pool.query("UPDATE candidatures SET status = ? WHERE id = ?", [status, id]);
  },
};

module.exports = Application;
