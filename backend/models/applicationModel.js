const db = require("../db"); // connexion MySQL

const Application = {
  create: (data, callback) => {
    db.query(
      "INSERT INTO applications (candidate_id, offer_id, cv) VALUES (?, ?, ?)",
      [data.candidate_id, data.offer_id, data.cv],
      callback
    );
  },

  getByCandidate: (candidate_id, callback) => {
    db.query(
      "SELECT * FROM applications WHERE candidate_id = ?",
      [candidate_id],
      callback
    );
  },

  getByOffer: (offer_id, callback) => {
    db.query(
      "SELECT * FROM applications WHERE offer_id = ?",
      [offer_id],
      callback
    );
  }
};

module.exports = Application;


