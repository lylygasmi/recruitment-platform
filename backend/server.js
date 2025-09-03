const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

// Import des routes
const employerRoutes = require('./routes/employerRoutes');
const authRoutes = require('./routes/auth');

const app = express();

// Middlewares
app.use(cors()); // autorise frontend localhost:3000 à appeler backend
app.use(bodyParser.json());

// Routes
app.use('/api/employers', employerRoutes);
app.use('/api/auth', authRoutes); // <-- important pour register/login

// Lancer le serveur
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));



