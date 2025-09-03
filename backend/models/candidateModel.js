const db = require('../config/db');

const Candidate = {
  create: (data, callback) => {
    const sql = 'INSERT INTO candidates SET ?';
    db.query(sql, data, callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM candidates';
    db.query(sql, callback);
  }
};

module.exports = Candidate;
