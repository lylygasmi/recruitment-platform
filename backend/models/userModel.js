const db = require("../db");

const User = {
  // Créer un utilisateur
  create: ({ name, email, password, role }, callback) => {
    const sql = "INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)";
    db.query(sql, [name, email, password, role], callback);
  },

  // Chercher un utilisateur par email
  findByEmail: (email, callback) => {
    const sql = "SELECT * FROM users WHERE email = ?";
    db.query(sql, [email], callback);
  },

  // Optionnel : récupérer un utilisateur par ID
  findById: (id, callback) => {
    const sql = "SELECT * FROM users WHERE id = ?";
    db.query(sql, [id], callback);
  },

  // Optionnel : récupérer tous les utilisateurs
  getAll: (callback) => {
    const sql = "SELECT id, name, email, role FROM users";
    db.query(sql, callback);
  },
};

module.exports = User;
