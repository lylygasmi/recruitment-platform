const { DataTypes } = require('sequelize');
const db = require('../config/db');
const Candidate = require('./candidateModel');
const JobOffer = require('./jobOfferModel');

const Application = db.define('application', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  candidate_id: { // ✅ Corrigé (avant : candidat_id)
    type: DataTypes.INTEGER,
    allowNull: false
  },
  offer_id: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('en_attente', 'acceptée', 'refusée'),
    defaultValue: 'en_attente'
  },
  date_posted: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  timestamps: false
});


// ✅ Associations (relations)
Application.belongsTo(Candidate, {
  foreignKey: 'candidate_id',
  as: 'candidate'
});

Application.belongsTo(JobOffer, {
  foreignKey: 'offer_id',
  as: 'offer'
});

JobOffer.hasMany(Application, {
  foreignKey: 'offer_id',
  as: 'applications'
});

Candidate.hasMany(Application, {
  foreignKey: 'candidate_id',
  as: 'applications'
});

module.exports = Application;
