const db = require('../db');

const createJobOffer = (employerId, title, description, location) => {
  const sql = 'INSERT INTO job_offers (employer_id, title, description, location) VALUES (?, ?, ?, ?)';
  return db.promise().execute(sql, [employerId, title, description, location]);
};

const getAllJobOffers = () => {
  const sql = 'SELECT * FROM job_offers ORDER BY created_at DESC';
  return db.promise().query(sql);
};

const getJobOfferById = (id) => {
  const sql = 'SELECT * FROM job_offers WHERE id = ?';
  return db.promise().execute(sql, [id]);
};

const updateJobOffer = (id, title, description, location) => {
  const sql = 'UPDATE job_offers SET title = ?, description = ?, location = ? WHERE id = ?';
  return db.promise().execute(sql, [title, description, location, id]);
};

const deleteJobOffer = (id) => {
  const sql = 'DELETE FROM job_offers WHERE id = ?';
  return db.promise().execute(sql, [id]);
};

module.exports = {
  createJobOffer,
  getAllJobOffers,
  getJobOfferById,
  updateJobOffer,
  deleteJobOffer
};
