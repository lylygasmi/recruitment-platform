const { DataTypes } = require('sequelize');
const db = require('../config/db'); // ⚠️ Assure-toi que db exporte bien l'instance Sequelize

const Candidate = db.define('candidate', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: { type: DataTypes.STRING, unique: true, allowNull: false },
  password: { type: DataTypes.STRING, allowNull: false },
  name: { type: DataTypes.STRING },
  speciality: { type: DataTypes.STRING },
  isVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verificationToken: { type: DataTypes.STRING },
  resetToken: { type: DataTypes.STRING },
  resetTokenExpiry: { type: DataTypes.DATE }
}, {
  tableName: 'users',       // 🔹 ton nom de table exact
  freezeTableName: true,    // 🔹 empêche Sequelize de pluraliser le nom
  timestamps: false         // 🔹 pas de createdAt/updatedAt
});

module.exports = Candidate;
