const db = require("../config/db");

const Application = {
  // Créer une candidature
  create: ({ candidate_id, job_offer_id, cv_filename }) =>
    db.promise().execute(
      "INSERT INTO applications (candidate_id, job_offer_id, cv_filename) VALUES (?, ?, ?)",
      [candidate_id, job_offer_id, cv_filename]
    ),

  // Récupérer toutes les candidatures d’un candidat
  getByCandidate: (candidate_id) =>
    db.promise().execute(
      "SELECT a.*, j.title AS job_title, j.company AS job_company " +
      "FROM applications a " +
      "JOIN job_offers j ON a.job_offer_id = j.id " +
      "WHERE a.candidate_id = ? ORDER BY a.created_at DESC",
      [candidate_id]
    ),

  // Récupérer toutes les candidatures pour une offre (employeur)
  getByOffer: (job_offer_id) =>
    db.promise().execute(
      "SELECT a.*, u.name AS candidate_name, u.email AS candidate_email " +
      "FROM applications a " +
      "JOIN users u ON a.candidate_id = u.id " +
      "WHERE a.job_offer_id = ? ORDER BY a.created_at DESC",
      [job_offer_id]
    ),

  // Mettre à jour le statut d’une candidature
  updateStatus: (id, status) =>
    db.promise().execute(
      "UPDATE applications SET status = ? WHERE id = ?",
      [status, id]
    ),

  // Supprimer une candidature par son propriétaire (candidat)
  delete: (id, candidate_id) =>
    db.promise().execute(
      "DELETE FROM applications WHERE id = ? AND candidate_id = ?",
      [id, candidate_id]
    ),
};

module.exports = Application;
