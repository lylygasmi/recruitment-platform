const db = require("../config/db");

const Candidate = {
  getById: (id) => {
    const sql = "SELECT id, name, email, role FROM users WHERE id = ?";
    return db.promise().execute(sql, [id]);
  },

  update: (id, { name, email, password }) => {
    const sql = "UPDATE users SET name = ?, email = ?, password = ? WHERE id = ?";
    return db.promise().execute(sql, [name, email, password, id]);
  }
};

module.exports = Candidate;
