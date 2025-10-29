const db = require("../config/db");

const User = {
  create: async ({ name, email, password, role, verificationToken }) => {
    const sql = `
      INSERT INTO users (name, email, password, role, verificationToken, isVerified)
      VALUES (?, ?, ?, ?, ?, false)
    `;
    return db.execute(sql, [name, email, password, role, verificationToken]);
  },

  findByEmail: async (email) => {
    const sql = "SELECT * FROM users WHERE email=?";
    return db.execute(sql, [email]);
  },

  findByToken: async (token) => {
    const sql = "SELECT * FROM users WHERE verificationToken=?";
    return db.execute(sql, [token]);
  },

  verifyUser: async (id) => {
    const sql = "UPDATE users SET isVerified=true, verificationToken=NULL WHERE id=?";
    return db.execute(sql, [id]);
  },

  setResetToken: async (email, token, expiry) => {
    const sql = "UPDATE users SET resetToken=?, resetTokenExpiry=? WHERE email=?";
    return db.execute(sql, [token, expiry, email]);
  },

  findByResetToken: async (token) => {
    const sql = "SELECT * FROM users WHERE resetToken=? AND resetTokenExpiry > NOW()";
    return db.execute(sql, [token]);
  },

  resetPassword: async (id, newPassword) => {
    const sql = "UPDATE users SET password=?, resetToken=NULL, resetTokenExpiry=NULL WHERE id=?";
    return db.execute(sql, [newPassword, id]);
  }
};

module.exports = User;

