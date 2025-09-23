const db = require("../db");

const CV = {
  create: ({ candidate_id, filename, filepath }) =>
    db.promise().execute(
      "INSERT INTO cvs (candidate_id, filename, filepath) VALUES (?, ?, ?)",
      [candidate_id, filename, filepath]
    ),

  getByCandidate: (candidate_id) =>
    db.promise().execute("SELECT * FROM cvs WHERE candidate_id = ?", [candidate_id]),

  delete: (id, candidate_id) =>
    db.promise().execute("DELETE FROM cvs WHERE id = ? AND candidate_id = ?", [id, candidate_id]),
};

module.exports = CV;
