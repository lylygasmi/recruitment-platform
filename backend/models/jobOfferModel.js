const pool = require("../config/db");

const JobOffer = {
  // Créer une offre
  async create({ employer_id, title, description, location, contract_type, specialite, salary }) {
    return await pool.query(
      `INSERT INTO job_offers 
       (employer_id, title, description, location, contract_type, specialite, salary, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [employer_id, title, description, location, contract_type, specialite, salary]
    );
  },

  // Récupérer toutes les offres d’un employeur
  async getByEmployer(employer_id) {
    return await pool.query(
      `SELECT * FROM job_offers WHERE employer_id = ? ORDER BY created_at DESC`,
      [employer_id]
    );
  },

  // Récupérer toutes les offres disponibles (pour un candidat)
  async getAll() {
    return await pool.query(
      `SELECT * FROM job_offers ORDER BY created_at DESC`
    );
  },

  // Récupérer une offre par ID
  async getById(id) {
    return await pool.query(
      `SELECT * FROM job_offers WHERE id = ?`,
      [id]
    );
  },

  // Mettre à jour une offre
  async update(id, data) {
    const fields = Object.keys(data).map(f => `${f} = ?`).join(", ");
    const values = Object.values(data);
    values.push(id);
    return await pool.query(
      `UPDATE job_offers SET ${fields}, updated_at = NOW() WHERE id = ?`,
      values
    );
  },

  // Supprimer une offre
  async delete(id) {
    return await pool.query(
      `DELETE FROM job_offers WHERE id = ?`,
      [id]
    );
  }
};

module.exports = JobOffer;
