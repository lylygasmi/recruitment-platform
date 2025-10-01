const db = require("../config/db");

const Candidature = {
  create: ({ candidate_id, offer_id, cv_filename }) =>
    db.promise().execute("INSERT INTO candidatures (candidate_id, offer_id, cv_filename) VALUES (?,?,?)", [candidate_id,offer_id,cv_filename]),
  getByCandidate: (candidate_id) =>
    db.promise().execute("SELECT * FROM candidatures WHERE candidate_id=?", [candidate_id]),
  getByOffer: (offer_id) =>
    db.promise().execute("SELECT * FROM candidatures WHERE offer_id=?", [offer_id]),
  delete: (id, candidate_id) =>
    db.promise().execute("DELETE FROM candidatures WHERE id=? AND candidate_id=?", [id, candidate_id])
};

module.exports = Candidature;
