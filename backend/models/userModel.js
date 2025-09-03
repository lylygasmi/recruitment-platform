const db = require('../config/db');

const User = {
  create: (user, callback) => {
    const sql = 'INSERT INTO users SET ?';
    db.query(sql, user, callback);
  },
  findByEmail: (email, callback) => {
    const sql = 'SELECT * FROM users WHERE email = ?';
    db.query(sql, [email], callback);
  }
};

module.exports = User;