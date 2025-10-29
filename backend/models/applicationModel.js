const pool = require("../config/db");

const Application = {
  // Créer une candidature
  async create({ candidat_id, offer_id, cv_path }) {
    return await pool.query(
      "INSERT INTO candidatures (candidat_id, offer_id, cv_path, date_posted, status) VALUES (?, ?, ?, NOW(), ?)",
      [candidat_id, offer_id, cv_path, "en attente"]
    );
  },

  // Récupérer les candidatures d’un candidat
  async getByCandidate(candidat_id) {
    return await pool.query(
      `SELECT c.*, j.title, j.company, j.location, j.contract_type 
       FROM candidatures c
       JOIN job_offers j ON c.offer_id = j.id
       WHERE c.candidat_id = ?`,
      [candidat_id]
    );
  },

  // Récupérer les candidatures pour une offre spécifique
  async getByOffer(offer_id) {
    return await pool.query(
      `SELECT c.*, u.name AS candidate_name, u.email 
       FROM candidatures c
       JOIN users u ON c.candidat_id = u.id
       WHERE c.offer_id = ?`,
      [offer_id]
    );
  },

  // Récupérer toutes les candidatures reçues par un employeur
  async getByEmployer(employer_id) {
    return await pool.query(
      `SELECT c.*, j.title, j.company, u.name AS candidate_name, u.email 
       FROM candidatures c
       JOIN job_offers j ON c.offer_id = j.id
       JOIN users u ON c.candidat_id = u.id
       WHERE j.employer_id = ?`,
      [employer_id]
    );
  },

  // Supprimer une candidature
  async delete(id, candidat_id) {
    return await pool.query(
      "DELETE FROM candidatures WHERE id = ? AND candidat_id = ?",
      [id, candidat_id]
    );
  },

  // Mettre à jour le statut
  async updateStatus(id, status) {
    return await pool.query("UPDATE candidatures SET status = ? WHERE id = ?", [
      status,
      id,
    ]);
  },
};

module.exports = Application;
