const { DataTypes } = require('sequelize');
const db = require('../config/db');

const JobOffer = db.define('job_offer', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  employer_id: { type: DataTypes.INTEGER, allowNull: false },
  title: { type: DataTypes.STRING },
  company: { type: DataTypes.STRING },
  description: { type: DataTypes.TEXT },
  location: { type: DataTypes.STRING },
  contract_type: { type: DataTypes.STRING },
  speciality: { type: DataTypes.STRING },
  salary: { type: DataTypes.STRING },
  currency: { type: DataTypes.STRING },
  country: { type: DataTypes.STRING },
  category: { type: DataTypes.STRING },
  technologies: { type: DataTypes.TEXT },
  created_at: { type: DataTypes.DATE },
  updated_at: { type: DataTypes.DATE }
}, {
  timestamps: false
});

module.exports = JobOffer;
