const multer = require('multer');
const fs = require('fs');

// Crée le dossier s’il n’existe pas
const uploadDir = 'uploads/cvs';
if (!fs.existsSync(uploadDir)) fs.mkdirSync(uploadDir, { recursive: true });

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, Date.now() + '-' + file.originalname)
});

module.exports = multer({ storage });


