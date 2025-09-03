const db = require('../config/db');

const Employer = {
  create: (data, callback) => {
    const sql = 'INSERT INTO employers SET ?';
    db.query(sql, data, callback);
  },
  getAll: (callback) => {
    const sql = 'SELECT * FROM employers';
    db.query(sql, callback);
  }
};

module.exports = Employer;
