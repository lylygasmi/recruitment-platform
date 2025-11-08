const { DataTypes } = require('sequelize');
const db = require('../config/db');

const CV = db.define('cv', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  candidate_id: { type: DataTypes.INTEGER, allowNull: false },
  offer_id: { type: DataTypes.INTEGER },
  title: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  file_path: { type: DataTypes.STRING },
  filename: { type: DataTypes.STRING },
  uploaded_at: { type: DataTypes.DATE, defaultValue: DataTypes.NOW }
}, {
  timestamps: false
});

module.exports = CV;
