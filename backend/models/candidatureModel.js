const db = require("../config/db");

const Candidature = {
  create: ({ candidate_id, offer_id, cv_filename }) => {
    const sql = "INSERT INTO candidatures (candidate_id, offer_id, cv_filename) VALUES (?, ?, ?)";
    return db.promise().execute(sql, [candidate_id, offer_id, cv_filename]);
  },

  getByCandidate: (candidate_id) => {
    const sql = "SELECT * FROM candidatures WHERE candidate_id=?";
    return db.promise().execute(sql, [candidate_id]);
  },

  getByOffer: (offer_id) => {
    const sql = "SELECT * FROM candidatures WHERE offer_id=?";
    return db.promise().execute(sql, [offer_id]);
  },

  updateStatus: (id, status) => {
    const sql = "UPDATE candidatures SET status=? WHERE id=?";
    return db.promise().execute(sql, [status, id]);
  },

  delete: (id, candidate_id) => {
    const sql = "DELETE FROM candidatures WHERE id=? AND candidate_id=?";
    return db.promise().execute(sql, [id, candidate_id]);
  },
};

module.exports = Candidature;
