const db = require("../config/db");

const User = {
  create: ({ name, email, password, role }) => {
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    return db.promise().execute(sql, [name, email, password, role]);
  },

  findByEmail: (email) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    return db.promise().execute(sql, [email]);
  },

  getById: (id) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    return db.promise().execute(sql, [id]);
  },
};

module.exports = User;
