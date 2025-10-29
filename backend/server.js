const express = require("express");
const cors = require("cors");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const candidatureRoutes = require("./routes/candidatureRoutes");
const offerRoutes = require("./routes/offerRoutes");

const app = express();

// Middleware général
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Pour servir les fichiers uploadés (CV)
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/candidatures", candidatureRoutes);
app.use("/api/offers", offerRoutes);

// Route test
app.get("/", (req, res) => {
  res.send("Backend Recruitment Platform fonctionne !");
});

// Lancement du serveur
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server démarré sur le port ${PORT}`);
});
