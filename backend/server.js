const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const fileUpload = require("express-fileupload");
require("dotenv").config();

const app = express(); // créer une seule fois l'app
const path = require("path");
// ------------------ Middlewares ------------------ //
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
// rendre le dossier uploads accessible publiquement
app.use("/uploads", express.static(path.join(__dirname, "uploads")));
// ------------------ Routes ------------------ //
const authRoutes = require("./routes/authRoutes");
const offerRoutes = require("./routes/offerRoutes");
const candidatureRoutes = require("./routes/candidatureRoutes");
const employerRoutes = require("./routes/employerRoutes");
const cvRoutes = require("./routes/cvRoutes"); // si tu as ajouté les CVs

app.use("/api/auth", authRoutes);
app.use("/api/offres", offerRoutes);
app.use("/api/candidatures", candidatureRoutes);
app.use("/api/employer", employerRoutes);
app.use("/api/cvs", cvRoutes);

// ------------------ Démarrage serveur ------------------ //
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
});
