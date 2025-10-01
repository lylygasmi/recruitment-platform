const db = require("../config/db");

const Employer = {
  getById: (id) => db.promise().query("SELECT * FROM users WHERE id=? AND role='employer'", [id]),

  createJobOffer: ({ employer_id, title, description, location }) =>
    db.promise().execute("INSERT INTO job_offers (employer_id, title, description, location) VALUES (?,?,?,?)",
      [employer_id, title, description, location]),

  updateJobOffer: (id, { title, description, location }) =>
    db.promise().execute("UPDATE job_offers SET title=?, description=?, location=? WHERE id=?",
      [title, description, location, id]),

  deleteJobOffer: (id) =>
    db.promise().execute("DELETE FROM job_offers WHERE id=?", [id]),

  getMyJobOffers: (employer_id) =>
    db.promise().execute("SELECT * FROM job_offers WHERE employer_id=? ORDER BY created_at DESC", [employer_id])
};

module.exports = Employer;
